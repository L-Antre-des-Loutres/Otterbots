import http from 'http';
import { Client } from 'discord.js';
import { otterlogs } from '../otterlogs';

/**
 * OtterHealthCheck utility class to expose a /healthcheck HTTP endpoint.
 */
export class OtterHealthCheck {
    private static server: http.Server | null = null;

    /**
     * Starts a lightweight HTTP server on the specified port.
     * @param client The Discord client instance (optional, for ping reporting).
     */
    public static start(client?: Client): void {
        const port = parseInt(process.env.HEALTHCHECK_PORT || '3000', 10);

        if (this.server) {
            otterlogs.warn("OtterHealthCheck: Server is already running.");
            return;
        }

        this.server = http.createServer((req, res) => {
            if (req.method === 'GET' && req.url === '/healthcheck') {
                const healthData = {
                    status: 'ok',
                    uptime: process.uptime(),
                    ping: client?.ws.ping || 0,
                    version: process.env.VERSION || 'unknown',
                    timestamp: new Date().toISOString()
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(healthData));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        this.server.listen(port, () => {
            otterlogs.success(`OtterHealthCheck: Listening on port ${port} (/healthcheck)`);
        });

        this.server.on('error', (err) => {
            otterlogs.error(`OtterHealthCheck: Server error: ${err.message}`);
        });
    }

    /**
     * Stops the health check server.
     */
    public static stop(): void {
        if (this.server) {
            this.server.close(() => {
                otterlogs.log("OtterHealthCheck: Server stopped.");
            });
            this.server = null;
        }
    }
}
