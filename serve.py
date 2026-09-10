#!/usr/bin/env python3
"""
High-Performance Local Range-Request HTTP Server for TAHA_PORTFOLIO
Supports streaming MP3 audio with HTTP 206 Partial Content (no ConnectionResetError).
"""
import os
import sys
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            return super().do_GET()

        range_header = self.headers.get('Range')
        if not range_header:
            return super().do_GET()

        # Handle HTTP 206 Partial Content for streaming MP3
        file_size = os.path.getsize(path)
        try:
            range_type, range_val = range_header.strip().split('=')
            if range_type != 'bytes':
                return super().do_GET()

            parts = range_val.split('-')
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if parts[1] else file_size - 1
            if end >= file_size:
                end = file_size - 1

            length = end - start + 1
            self.send_response(206)
            mime, _ = mimetypes.guess_type(path)
            self.send_header('Content-Type', mime or 'application/octet-stream')
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(length))
            self.end_headers()

            with open(path, 'rb') as f:
                f.seek(start)
                sent = 0
                while sent < length:
                    chunk = f.read(min(65536, length - sent))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    sent += len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass
        except Exception:
            return super().do_GET()

if __name__ == '__main__':
    print(f"Serving Taha's Portfolio at: http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    server = HTTPServer(('', PORT), RangeRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
