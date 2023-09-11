import { config } from 'dotenv';

class DatabaseHandler {
    constructor() {
        config();
        this.name = 'DatabaseHandler';
    }
}

export { DatabaseHandler }; 