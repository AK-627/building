-- Create about_config table to hold the editable About Section text
CREATE TABLE IF NOT EXISTS about_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL
);

-- Insert a default row
INSERT INTO about_config (content) VALUES (
    'Lodha Sadahalli – A New Benchmark of Luxury Living in Bangalore.

Introducing Lodha Sadahalli, a landmark residential development inspired by the grandeur of Balmoral Castle. This iconic **80-acre** project beautifully blends Neo-Classical architecture with European garden estates. With **85% lush open spaces**, expansive residences ranging from **2,200 to 5,000 sq. ft.**, and a starting price of **₹3.5 Cr**, it offers a rare balance of luxury and nature.

An address of distinction, where legacy meets luxury.'
) ON CONFLICT DO NOTHING;

-- Set up Row Level Security
ALTER TABLE about_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on about_config"
    ON about_config FOR SELECT
    TO public
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on about_config"
    ON about_config FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
