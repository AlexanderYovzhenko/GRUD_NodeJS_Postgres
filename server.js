import http from 'http';
import { PORT } from './src/common/config.js';
import routes from './src/routes/routes.js';

const server = http.createServer(routes);

server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
