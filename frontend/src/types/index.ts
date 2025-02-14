export interface Industry {
    industry_id: number;
    industry_name: string;
    industry_type: string;
    contact_number: string;
    latitude: number;
    longitude: number;
  }
  
  export interface Product {
    product_id: number;
    product_name: string;
    quantity: number;
    price_per_unit: number;
    producing_industry_id: number;
  }
  
  export interface SearchResult extends Product {
    industry_name: string;
    distance_km: number;
  }
  
  export interface AuthResponse {
    access_token: string;
    token_type: string;
  }