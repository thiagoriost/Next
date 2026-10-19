-- Create enum types
CREATE TYPE property_type AS ENUM ('sale', 'rent');
CREATE TYPE property_category AS ENUM ('House', 'Apartment', 'Villa', 'Penthouse');
CREATE TYPE property_badge_type AS ENUM ('exclusive', 'new', 'sale', 'rent');
CREATE TYPE price_period AS ENUM ('mo', 'year');

-- Create properties table
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_period price_period,
  type property_type NOT NULL,
  category property_category NOT NULL,
  beds NUMERIC NOT NULL,
  baths NUMERIC NOT NULL,
  area_sq_m NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  badge TEXT,
  badge_type property_badge_type,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON properties
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- Insert featured properties
INSERT INTO properties (id, title, location, price, type, category, beds, baths, area_sq_m, image_url, image_alt, badge, badge_type, is_featured) VALUES
('feat-1', 'The Glass Pavilion', 'Beverly Hills, California', 5250000, 'sale', 'Villa', 5, 4.5, 4200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM', 'Luxury modern villa exterior with pool', 'Exclusive', 'exclusive', TRUE),
('feat-2', 'Azure Heights Penthouse', 'Downtown, Vancouver', 3800000, 'sale', 'Penthouse', 3, 3, 2100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s', 'Modern interior living room with view', 'New Arrival', 'new', TRUE);

-- Insert market properties
INSERT INTO properties (id, title, location, price, price_period, type, category, beds, baths, area_sq_m, image_url, image_alt, badge, badge_type, is_featured) VALUES
('market-1', 'Modern Family Home', '123 Pine St, Seattle', 850000, NULL, 'sale', 'House', 3, 2, 120, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYawCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E', 'Modern white house facade', 'FOR SALE', 'sale', FALSE),
('market-2', 'Urban Loft', '456 Elm Ave, Portland', 3200, 'mo', 'rent', 'Apartment', 1, 1, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4', 'Stylish apartment living room', 'FOR RENT', 'rent', FALSE),
('market-3', 'Highland Retreat', '789 Mountain Rd, Bend', 620000, NULL, 'sale', 'House', 2, 2, 98, 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro', 'Cabin in the woods exterior', 'FOR SALE', 'sale', FALSE),
('market-4', 'Sea View Penthouse', '321 Ocean Dr, Miami', 4500, 'mo', 'rent', 'Penthouse', 3, 3, 180, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U', 'Bright bedroom with large window', 'FOR RENT', 'rent', FALSE),
('market-5', 'Central Studio', '555 Main St, Chicago', 550000, NULL, 'sale', 'Apartment', 1, 1, 50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE', 'Cozy apartment interior', 'FOR SALE', 'sale', FALSE),
('market-6', 'Garden Villa', '999 Oak Ln, Austin', 2800, 'mo', 'rent', 'Villa', 2, 2, 110, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8', 'Modern minimalist home exterior', 'FOR RENT', 'rent', FALSE),
('market-7', 'Villa Bellissima', '742 Vista Del Mar, Malibu', 4850000, NULL, 'sale', 'Villa', 5, 5.5, 520, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80', 'Modern luxury villa in Malibu with infinity pool', 'FOR SALE', 'sale', FALSE),
('market-8', 'The Grand Solarium Penthouse', '100 Brickell Ave, Miami', 3250000, NULL, 'sale', 'Penthouse', 4, 4, 340, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', 'Contemporary luxury penthouse terrace with city vista', 'FOR SALE', 'sale', FALSE),
('market-9', 'SoHo Artisan Loft', '72 Mercer St, New York', 5800, 'mo', 'rent', 'Apartment', 2, 2, 145, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'High-ceiling luxury loft interior in SoHo', 'FOR RENT', 'rent', FALSE),
('market-10', 'Oakhaven Modern Estate', '810 Beverly Glen, Los Angeles', 2150000, NULL, 'sale', 'House', 4, 3.5, 280, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', 'Illuminated modern luxury house at dusk', 'FOR SALE', 'sale', FALSE),
('market-11', 'Palacio de la Luz', '304 Palm Canyon Dr, Palm Springs', 7500, 'mo', 'rent', 'Villa', 4, 4, 380, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80', 'Modern Palm Springs desert villa with pool', 'FOR RENT', 'rent', FALSE),
('market-12', 'The Glass Horizon Penthouse', '188 Minna St, San Francisco', 8200, 'mo', 'rent', 'Penthouse', 3, 3, 215, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', 'Luxury glass penthouse with panoramic city views', 'FOR RENT', 'rent', FALSE),
('market-13', 'Lumiere Waterfront Suite', '520 Lake Shore Dr, Chicago', 790000, NULL, 'sale', 'Apartment', 2, 2, 115, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', 'Sunlit modern minimalist living room', 'FOR SALE', 'sale', FALSE),
('market-14', 'Nordic Pine Sanctuary', '62 Rainier Way, Seattle', 3900, 'mo', 'rent', 'House', 3, 2.5, 175, 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80', 'Contemporary Nordic inspired residential house', 'FOR RENT', 'rent', FALSE),
('market-15', 'Miramar Oceanfront Villa', '12 Cliffside Dr, Carmel', 6400000, NULL, 'sale', 'Villa', 6, 6, 590, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80', 'Ultra-luxury contemporary oceanfront villa', 'FOR SALE', 'sale', FALSE),
('market-16', 'Skycrest Penthouse Residence', '250 West St, New York', 4950000, NULL, 'sale', 'Penthouse', 3, 3.5, 290, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', 'Spacious architectural penthouse interior with modern design', 'FOR SALE', 'sale', FALSE),
('market-17', 'Serene Lakeside Haven', '402 Emerald Bay, Lake Tahoe', 1450000, NULL, 'sale', 'House', 4, 3, 240, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'Serene lakeside luxury home', 'FOR SALE', 'sale', FALSE),
('market-18', 'Skyline Horizon Residence', '88 Hudson Yards, New York', 6200, 'mo', 'rent', 'Penthouse', 2, 2, 135, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 'Luxury high rise apartment interior', 'FOR RENT', 'rent', FALSE),
('market-19', 'Minimalist Forest Sanctuary', '15 Aspen Ridge, Aspen', 2950000, NULL, 'sale', 'Villa', 3, 3.5, 310, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', 'Modern minimalist architectural villa in nature', 'FOR SALE', 'sale', FALSE);;
