use std::{env, io::{Read, Write}, net::TcpStream, str::FromStr, sync::Arc, thread::spawn, vec};

use byteorder::{BigEndian, ReadBytesExt, WriteBytesExt};
use rustls::{ClientSession, ServerCertVerified};
use webpki::DNSNameRef;
use tiny_http::{Header, Response, Server};

pub const IP: &str = "46.254.16.245";
pub const CERT_ADDR: &str = "46.254.16.245:4027";
pub const HTTPS_ADDR: &str = "46.254.16.245:4026";
pub const MEDIA_ADDR: &str = "46.254.16.245:4023";

pub const MEDIA_PREFIX: &str = "__proxy__(media):";

pub const SPLIT_SIZE: u32 = 1024;

pub struct NoCertificateVerification;

impl rustls::ServerCertVerifier for NoCertificateVerification {
    #[allow(deprecated)]
    fn verify_server_cert(
        &self,
        _roots: &rustls::RootCertStore,
        _presented_certs: &[rustls::Certificate],
        _dns_name: DNSNameRef,
        _ocsp_response: &[u8],
    ) -> Result<rustls::ServerCertVerified, rustls::TLSError> {
        Ok(ServerCertVerified::assertion())
    }
}

pub fn create_session() -> ClientSession {
    let mut cfg = rustls::ClientConfig::new();
    cfg.enable_sni = false;
    cfg.dangerous().set_certificate_verifier(Arc::new(NoCertificateVerification {}));
    ClientSession::new(
        &Arc::new(cfg),
        DNSNameRef::try_from_ascii_str("x").unwrap()
    )
}
pub fn create_tcpstream() -> std::io::Result<TcpStream> {
    TcpStream::connect(HTTPS_ADDR)
}
pub fn create_tcpstream_media() -> std::io::Result<TcpStream> {
    TcpStream::connect(MEDIA_ADDR)
}

macro_rules! http_unwrap {
    ($r:expr, $req:expr) => {
        if let Ok(x) = $r {
            x
        } else {
            println!("{:?}", $r.unwrap_err());
            let error_msg = format!("{{\"__proxy_error__\": \"Something went wrong.\"}}");
            let mut resp = Response::from_string(error_msg);
            resp.add_header(Header::from_str("Access-Control-Allow-Origin: *").unwrap());

            let result = $req.respond(resp);
            if let Err(_) = result {
                println!("[srv] disconnected incorrectly");
            };
            return;
        }
    };
}
macro_rules! unwrap_or_down {
    ($r:expr, $req:expr) => {
        if let Ok(x) = $r {
            x
        } else {
            $req.respond(
                Response::from_string("down")
                    .with_status_code(503)
            ).unwrap();
            panic!();
        }
    };
}

fn main() {
    let server = Server::http(
        format!("0.0.0.0:{}", env::var("PORT").unwrap_or_else(|_| "8080".to_string()))
    ).expect("failed to start server");
    for mut request in server.incoming_requests() {
        spawn(move || {

        if request.url().starts_with("/yt/") {
            let id = &request.url()[4..];
            println!("[srv] type=yt id={}", id);
            let mut img = Vec::new();
            ureq::get(&*format!("https://img.youtube.com/vi/{}/0.jpg", id))
                .call().unwrap().into_reader().read_to_end(&mut img).unwrap();
            let mut resp = Response::from_data(img);
            resp.add_header(Header::from_str("Access-Control-Allow-Origin: *").unwrap());
            request.respond(resp).unwrap();
            return;
        }
        if request.url().starts_with("/ping") {
            println!("[srv] type=ping");
            let mut sess = create_session();
            let mut sock = unwrap_or_down!(create_tcpstream(), request);
            let mut tls = rustls::Stream::new(&mut sess, &mut sock);
            let payload = "{\
                \"J_REQUEST_NAME\": \"RProjectVersionGet\",\
                \"J_REQUEST_DATE\": 1626604387812000000,\
                \"requestApiVersion\": \"1.251\",\
                \"requestProjectKey\": \"Campfire\"
            }";
            unwrap_or_down!(tls.write_u32::<BigEndian>(payload.as_bytes().len() as u32), request);
            unwrap_or_down!(tls.write_all(payload.as_bytes()), request);

            let len = unwrap_or_down!(tls.read_u32::<BigEndian>(), request);
            request.respond(Response::from_string(len.to_string())).unwrap();
            return;
        }

        // check and prepare
        if request.body_length().unwrap_or(5242880) >= 5242880 { // 5 MiB
            println!("[srv] type=dropping");
            return;
        }
        let reader = request.as_reader();
        let mut req = Vec::new();
        let len = {
            let mut str = String::new();
            loop {
                let char = http_unwrap!(reader.read_u8(), request) as char;
                if char == ':' { break; }
                str.push(char);
            }
            http_unwrap!(str.parse::<u32>(), request)
        };
        http_unwrap!(reader.read_to_end(&mut req), request);
        let media_req = req.starts_with(MEDIA_PREFIX.as_bytes());

        // connect
        let mut sess = create_session();
        let mut sock = http_unwrap!(if media_req {
            create_tcpstream_media()
        } else { create_tcpstream() }, request);
        let mut tls = rustls::Stream::new(&mut sess, &mut sock);

        // send
        let b = if media_req {
            &req[MEDIA_PREFIX.len()..]
        } else { &req };
        println!("[fwd] type=request length={} client_length={}", b.len(), len);
        http_unwrap!(tls.write_u32::<BigEndian>(len), request);
        http_unwrap!(tls.write_all(b), request);

        // read
        let len = http_unwrap!(tls.read_u32::<BigEndian>(), request);
        let mut resp = vec![0u8; len as usize];
        http_unwrap!(tls.read_exact(&mut resp), request);
        println!("[fwd] type=response length={}", len);

        // forward
        let result = request.respond({
            let mut resp = Response::from_data(resp);
            resp.add_header(Header::from_str("Access-Control-Allow-Origin: *").unwrap());
            resp
        });
        if result.is_err() {
            println!("[srv] type=disconnected incorrectly");
        }
        
        });
    }
}
