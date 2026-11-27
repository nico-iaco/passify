"""Riceve via POST i voti raccolti dal browser e li salva in un file. Uso: python3 ricevitore.py OUT.json
Si chiude da solo dopo aver ricevuto i dati."""
import http.server, sys
out = sys.argv[1]
class H(http.server.BaseHTTPRequestHandler):
    def _c(self):
        self.send_header("Access-Control-Allow-Origin", "https://www.examtopics.com")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")
    def do_OPTIONS(self): self.send_response(204); self._c(); self.end_headers()
    def do_POST(self):
        b = self.rfile.read(int(self.headers["Content-Length"])); open(out, "wb").write(b)
        self.send_response(200); self._c(); self.end_headers(); self.wfile.write(b"ok")
        print("salvato", out, len(b), "byte", flush=True); raise SystemExit
s = http.server.HTTPServer(("127.0.0.1", 8765), H)
try: s.serve_forever()
except SystemExit: pass
