use std::{env, io::{Read, Write}, net::{TcpListener, TcpStream}, sync::Arc, thread::spawn, vec};

use byteorder::{BigEndian, ReadBytesExt, WriteBytesExt};
use rustls::{ClientSession, ServerCertVerified};
use tungstenite::{Message, accept};
use webpki::DNSNameRef;

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

fn main() {
    let server = TcpListener::bind(
        format!("0.0.0.0:{}", env::var("PORT").unwrap_or_else(|_| "8080".to_string()))
    ).expect("failed to bind");
    for stream in server.incoming() {
        spawn(move || {
            println!("[ws ] new connection");
            let mut ws = accept(stream.unwrap()).unwrap();
            loop {
                let msg = ws.read_message().unwrap();
                if let Ok(s) = msg.to_text() {
                    let media_req = s.starts_with(MEDIA_PREFIX);
                    if media_req {
                        println!("[fwd] recieved media request");
                    }

                    // connect
                    let mut sess = create_session();
                    let mut sock = if media_req {
                        create_tcpstream_media()
                    } else {
                        create_tcpstream()
                    };
                    let mut tls = rustls::Stream::new(
                        &mut sess, &mut sock
                    );
                    
                    // send
                    let b = if media_req {
                        &s.as_bytes()[MEDIA_PREFIX.len()..]
                    } else {
                        s.as_bytes()
                    };
                    println!("[fwd] request length: {}B", b.len());
                    tls.write_u32::<BigEndian>(b.len() as u32).unwrap();
                    tls.write_all(b).unwrap();

                    // read
                    let len = tls.read_u32::<BigEndian>().unwrap();
                    println!("[fwd] response length: {}B", len);
                    let mut v = vec![0u8; len as usize];
                    tls.read_exact(&mut v).unwrap();

                    // forward
                    if media_req {
                        ws.write_message(Message::Binary(v)).unwrap();
                    } else {
                        ws.write_message(Message::Text(
                            String::from_utf8(v).unwrap()
                        )).unwrap();
                    }
                } else {
                    ws.write_message(Message::Text("{\"__proxy_error__\": \"non_text\"}".to_string())).unwrap();
                }
            }
        });
    }
}
