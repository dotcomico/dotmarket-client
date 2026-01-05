class Config {
    // all general project configurations go here
    INTERVAL_TIME = 2000;
}

class DevelopmentConfig extends Config {
    // PRODUCTS_API_URL = 'https://dummyjson.com/products/';
    // USERS_API_URL = 'https://dummyjson.com/users/';
    // JOKES_API_URL = 'https://official-joke-api.appspot.com/jokes/programming/ten';
}

class ProductionConfig extends Config {
    // PRODUCTS_API_URL = 'https://www.ourcompany.com/api/products/';
    // USERS_API_URL = 'https://www.ourcompany.com/api/users/';
    // JOKES_API_URL = 'https://www.ourcompany.com/api/jokes/programming/ten';
}



// יש לערוך נתונים ב tscongig.app.json!
// מחובר יחדיו בדרך "אוטומטית"
export const config = process.env.NODE_ENV === 'development'? new DevelopmentConfig() : new ProductionConfig();