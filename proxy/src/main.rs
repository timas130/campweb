use std::{env, io::{Read, Write}, net::TcpStream, str::FromStr, sync::Arc, thread::spawn, vec};

use byteorder::{BigEndian, ReadBytesExt, WriteBytesExt};
use rustls::{ClientSession, ServerCertVerified};
use webpki::DNSNameRef;
use tiny_http::{Header, Method, Response, Server, StatusCode};

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
pub fn create_tcpstream() -> TcpStream {
    TcpStream::connect(HTTPS_ADDR).unwrap()
}
pub fn create_tcpstream_media() -> TcpStream {
    TcpStream::connect(MEDIA_ADDR).unwrap()
}

macro_rules! http_unwrap {
    ($r:expr, $req:expr) => {
        if let Ok(x) = $r {
            x
        } else {
            let error_msg = format!("{{\"__proxy_error__\": \"Something went wrong.\"}}");

            let result = $req.respond(
                Response::from_string(error_msg)
            );
            if let Err(_) = result {
                println!("[srv] disconnected incorrectly");
            };
            return;
        }
    };
}

fn main() {
    let server = Server::http(
        format!("0.0.0.0:{}", env::var("PORT").unwrap_or_else(|_| "8080".to_string()))
    ).expect("failed to start server");
    for mut request in server.incoming_requests() {
        spawn(move || {

        // check and prepare
        if request.body_length().unwrap_or(5242880) >= 5242880 { // 5 MiB
            println!("[srv] type=dropping");
            return;
        }
        let reader = request.as_reader();
        let mut req = String::new();
        http_unwrap!(reader.read_to_string(&mut req), request);
        let media_req = req.starts_with(MEDIA_PREFIX);

        // connect
        let mut sess = create_session();
        let mut sock = if media_req {
            create_tcpstream_media()
        } else { create_tcpstream() };
        let mut tls = rustls::Stream::new(&mut sess, &mut sock);

        // send
        let b = if media_req {
            &req.as_bytes()[MEDIA_PREFIX.len()..]
        } else { req.as_bytes() };
        println!("[fwd] type=request length={}", b.len());
        http_unwrap!(tls.write_u32::<BigEndian>(b.len() as u32), request);
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
        if let Err(_) = result {
            println!("[srv] type=disconnected incorrectly");
        }
        
        });
    }
}
