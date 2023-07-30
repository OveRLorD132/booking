--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    text character varying(500) NOT NULL,
    user_id bigint NOT NULL,
    rent_id bigint NOT NULL,
    rating numeric(3,2) DEFAULT 5 NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: complains; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complains (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    reason character varying NOT NULL,
    text character varying,
    rent_id bigint NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_accepted boolean DEFAULT false
);


ALTER TABLE public.complains OWNER TO postgres;

--
-- Name: complains_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complains_id_seq OWNER TO postgres;

--
-- Name: complains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complains_id_seq OWNED BY public.complains.id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL,
    name character varying(30)
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversations_id_seq OWNER TO postgres;

--
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    conversation_id bigint,
    text character varying(300)
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: rental_properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental_properties (
    address character varying(255),
    description character varying(1000),
    price numeric(12,2),
    id bigint NOT NULL,
    type character varying(50),
    header character varying(50),
    user_id integer NOT NULL,
    is_hidden boolean DEFAULT false
);


ALTER TABLE public.rental_properties OWNER TO postgres;

--
-- Name: rental_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rental_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_properties_id_seq OWNER TO postgres;

--
-- Name: rental_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rental_properties_id_seq OWNED BY public.rental_properties.id;


--
-- Name: rental_properties_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rental_properties_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_properties_user_id_seq OWNER TO postgres;

--
-- Name: rental_properties_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rental_properties_user_id_seq OWNED BY public.rental_properties.user_id;


--
-- Name: user_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_feedback (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    profile_id bigint NOT NULL,
    text character varying(500) NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_feedback OWNER TO postgres;

--
-- Name: user_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_feedback_id_seq OWNER TO postgres;

--
-- Name: user_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_feedback_id_seq OWNED BY public.user_feedback.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(50),
    password character varying(255),
    email character varying(50),
    id bigint NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    wishlist integer[],
    join_date date DEFAULT CURRENT_TIMESTAMP,
    birth_date date DEFAULT '2005-06-26'::date,
    gender character varying(12),
    country character varying(200),
    phone_number character varying,
    type character varying(10),
    description character varying(300)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: complains id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complains ALTER COLUMN id SET DEFAULT nextval('public.complains_id_seq'::regclass);


--
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: rental_properties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_properties ALTER COLUMN id SET DEFAULT nextval('public.rental_properties_id_seq'::regclass);


--
-- Name: rental_properties user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_properties ALTER COLUMN user_id SET DEFAULT nextval('public.rental_properties_user_id_seq'::regclass);


--
-- Name: user_feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_feedback ALTER COLUMN id SET DEFAULT nextval('public.user_feedback_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, text, user_id, rent_id, rating, date) FROM stdin;
\.


--
-- Data for Name: complains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.complains (id, user_id, reason, text, rent_id, date, is_accepted) FROM stdin;
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, user1_id, user2_id, name) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, user_id, date, conversation_id, text) FROM stdin;
\.


--
-- Data for Name: rental_properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rental_properties (address, description, price, id, type, header, user_id, is_hidden) FROM stdin;
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Experience city living at its \r\nfinest in this modern apartment with stunning skyline views. The apartment offers a \r\nsleek design and all the comforts you need. Explore nearby attractions, restaurants, and entertainment. \r\nPerfect for urban explorers and business travelers seeking a convenient and stylish stay.	150.00	24	Apartments	Modern City Apartment with Skyline Views	9	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Immerse yourself in the elegance of our townhouse located \r\nin a historic neighborhood. The townhouse features sophisticated decor, modern amenities, and a private garden. \r\nExplore nearby landmarks, museums, and cafes, all within walking distance. Ideal for history enthusiasts and \r\ntravelers seeking refined accommodation.	180.00	7	House	Elegant Townhouse in Historic Neighborhood	3	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Embrace tranquility at our lakeside cottage with \r\nbreathtaking sunset views. Unwind on the deck overlooking the lake or enjoy water activities from \r\nyour private dock. The cottage offers a cozy interior with all the comforts you need. Ideal for \r\nfamilies or couples seeking a peaceful lakeside retreat.	180.00	13	Villa	Lakeside Cottage with Sunset Views	5	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Discover the charm of a rustic farmhouse \r\nnestled amidst the vineyards. This cozy retreat offers a taste of countryside living with \r\nmodern comforts. Enjoy wine tastings, scenic walks, and peaceful evenings on the patio. \r\nPerfect for wine enthusiasts and those looking for a peaceful countryside escape.	190.00	11	House	Rustic Farmhouse Retreat in the Vineyards	5	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Stay in the heart of the city in this stylish studio \r\nwith urban vibes. Walk to nearby cafes, shops, and cultural hotspots. The studio boasts a contemporary \r\ndesign with all the essentials for a comfortable stay. Perfect for city explorers and business \r\ntravelers seeking convenience and modern living.	120.00	12	Room	City Center Studio with Urban Vibes	5	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Escape to this quaint cottage located in a peaceful village. \r\nEnjoy the tranquility of the countryside and the charm of a traditional cottage. \r\nThe property features a lovely garden, perfect for relaxing or having a barbecue. \r\nIdeal for couples or small families seeking a serene retreat away from the city.	130.00	20	Villa	Quaint Cottage in a Peaceful Village	8	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Immerse yourself in nature \r\nat this lakeside lodge with stunning views. The lodge offers a cozy interior with all \r\nthe essential amenities for a comfortable stay. Unwind on the deck overlooking the lake \r\nor explore the nearby hiking trails. Ideal for nature enthusiasts and anyone seeking a \r\npeaceful lakeside escape.	160.00	21	House	Lakeside Lodge with Stunning Nature Views	8	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Retreat to this secluded forest treehouse for a unique \r\nand enchanting experience. Nestled among the trees, the treehouse offers a peaceful escape with \r\na cozy interior and a stunning view. Disconnect from the world and immerse yourself in nature. \r\nIdeal for adventurous souls and those seeking an off-grid getaway.	170.00	9	House	Secluded Forest Treehouse	4	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Indulge in contemporary luxury \r\nat this modern riverside villa with an infinity pool. Immerse yourself in tranquility with \r\nthe soothing sound of the river. The villa boasts sleek design, spacious rooms, and a \r\nwell-equipped kitchen. Perfect for families or groups looking for a serene and lavish retreat.	380.00	28	Villa	Modern Riverside Villa with Infinity Pool	10	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Experience luxury living in this stunning \r\nocean view penthouse with a private rooftop terrace. Enjoy panoramic views of the sea and the city skyline. \r\nThe penthouse offers elegant furnishings, modern amenities, and access to a shared pool and gym. \r\nPerfect for discerning travelers seeking an opulent coastal retreat.	600.00	26	Penthouse	Ocean View Penthouse with Rooftop Terrace	10	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Stay in this elegant townhouse with a beautiful garden retreat. \r\nThe townhouse boasts sophisticated interiors and a serene outdoor space. Explore the vibrant \r\nneighborhood with its cafes and boutiques. Perfect for couples or small groups seeking a stylish \r\nand relaxing stay in the heart of the city.	190.00	22	House	Elegant Townhouse with Garden Retreat	8	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Embrace lakeside living in this charming cabin with a private dock. \r\nEnjoy fishing, swimming, or simply relaxing by the water. The cabin features a rustic interior with \r\nmodern amenities. Ideal for families or friends looking for a lakeside adventure and a place to \r\ncreate lasting memories.	180.00	23	Room	Lakeside Cabin with Private Dock	9	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	 Experience luxury and relaxation in our \r\nexquisite seaside villa. The villa boasts breathtaking ocean views, a private pool, \r\nand direct access to the beach. Indulge in the modern amenities and spacious rooms. \r\nIdeal for a group getaway or a romantic escape. Treat yourself to a memorable vacation by the sea!	100.00	2	Villa	Seaside Villa with Stunning Ocean Views	1	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Step into paradise at our beachfront \r\nbungalow with direct access to the sandy shore. Bask in the sun on your private beach terrace or \r\ntake a dip in the crystal-clear waters. The bungalow offers a comfortable bedroom, a well-equipped \r\nkitchen, and stunning ocean views. Ideal for beach lovers and sunseekers.	280.00	10	Room	Beachfront Bungalow with Private Beach Access	4	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Unwind in this secluded mountain retreat with \r\nits own private hot springs. Embrace the serenity of nature and indulge in relaxation. \r\nThe retreat offers a cozy cabin with all the essentials for a peaceful stay. \r\nIdeal for nature lovers and anyone seeking a rejuvenating escape in the mountains.	220.00	25	Guesthouse	Secluded Mountain Retreat with Hot Springs	9	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Embark on a magical adventure at this \r\nenchanting treehouse retreat nestled in the heart of the forest. Live among the treetops and \r\nconnect with nature. The treehouse features a cozy interior with unique decor and a private balcony. \r\nIdeal for nature lovers and those seeking a whimsical escape.	140.00	27	House	Enchanted Treehouse Retreat in the Forest	10	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Indulge in luxury at our stunning beachfront penthouse. \r\nEnjoy panoramic ocean views from the private terrace and relax in the elegant interior. \r\nThe penthouse offers top-notch amenities, including a spa and a rooftop pool. \r\nTreat yourself to an unforgettable experience in this exclusive retreat by the sea.	800.00	5	Penthouse	Luxurious Beachfront Penthouse	2	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Discover serenity at our lakeside retreat with a private dock. \r\nEmbrace stunning lake views and enjoy water activities right from your doorstep. \r\nThe retreat offers comfortable bedrooms, a spacious living area, and a fully equipped kitchen. \r\nIdeal for families or friends seeking a peaceful lakeside vacation.	250.00	6	Room	Lakeside Retreat with Private Dock	3	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Stay in this stylish modern loft located in the \r\nheart of the historic district. The loft features high ceilings, industrial-inspired decor, \r\nand all the amenities you need for a comfortable stay. Explore nearby museums, art galleries, \r\nand iconic landmarks. Perfect for urban explorers and art enthusiasts!	150.00	3	House	Modern Loft in the Historic District	2	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Unwind in this serene cabin retreat nestled in \r\nthe midst of the woods. Surround yourself with nature and enjoy the peaceful atmosphere. \r\nThe cabin offers rustic charm with modern comforts, including a fireplace and a hot tub. \r\nIdeal for nature lovers and those seeking a quiet escape from city life.	180.00	4	Guesthouse	Serene Cabin Retreat in the Woods	2	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Experience the beauty of the mountains in this \r\ncharming chalet with breathtaking panoramic views. The chalet offers a warm and inviting atmosphere\r\nwith wooden interiors and a stone fireplace. Enjoy outdoor activities and explore nearby hiking trails. \r\nPerfect for nature lovers and those seeking a mountain retreat.	220.00	8	Apartments	Mountain Chalet with Panoramic Views	4	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Stay in this modern city loft with stunning skyline views. \r\nExperience the vibrancy of city living and explore nearby attractions and nightlife. \r\nThe loft features an open layout with contemporary decor and high-end amenities. \r\nIdeal for city adventurers and travelers looking for a sophisticated urban experience.	200.00	16	Duplex	Modern City Loft with Skyline Views	6	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Enjoy the beach \r\nlife at our beachside retreat with private access to the shore. Wake up to the sound \r\nof waves and take long walks along the sandy beach. The retreat offers a cozy beach \r\nhouse with modern amenities and ocean views. Ideal for beach lovers and anyone seeking \r\na tranquil coastal getaway.	250.00	19	House	Beachside Retreat with Private Access to the Shore	7	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Immerse yourself in city life \r\nwith this urban chic apartment located in a trendy neighborhood. The apartment features \r\ncontemporary design and all the modern amenities you need for a comfortable stay. \r\nExplore nearby cafes, boutiques, and art galleries. Perfect for city enthusiasts and \r\ntravelers seeking an authentic urban experience.	140.00	14	Apartments	Urban Chic Apartment in Trendy Neighborhood	6	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Indulge in luxury at our exquisite villa \r\nfeaturing a private pool and spa. Enjoy the ultimate relaxation in the comfort of a stylish \r\nand spacious villa. Take in the stunning views from the terrace and savor the tranquility \r\nof the surroundings. Perfect for families or groups seeking a lavish and private vacation.	500.00	17	Villa	Luxury Villa with Private Pool and Spa	7	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Step back in time \r\nwith a historic castle experience in the picturesque countryside. This unique \r\naccommodation offers a glimpse into the past with opulent interiors and medieval charm. \r\nExplore the castle grounds and immerse yourself in its rich history. Perfect \r\nfor history enthusiasts and those seeking a fairy-tale-like stay.	400.00	18	House	Historic Castle Experience in the Countryside	7	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Welcome to our charming apartment located \r\nin the heart of the city. This cozy space features a comfortable bedroom, a fully equipped kitchen, \r\nand a stylish living area. Enjoy the convenience of nearby cafes, restaurants, and shopping centers.\r\nPerfect for couples or solo travelers. Book your stay now!	100.00	1	Apartments	Apartment in the Heart of the City	1	f
{"addressLine":"Address","city":["╨Ы╨╛╤А╤М╤П╨╜"],"postIndex":["56100"],"country":["╨д╤А╨░╨╜╤Ж╨╕╤П"],"coords":{"lat":-33.893792296938784,"lng":151.16310400390626}}	Retreat to this tranquil cabin nestled by the riverside. \r\nEmbrace the soothing sounds of nature and enjoy a peaceful escape from the busy world. \r\nThe cabin offers a rustic ambiance with modern comforts, including a fireplace and a hot tub. \r\nIdeal for nature lovers and those seeking relaxation by the water.	190.00	15	Room	Tranquil Riverside Cabin Retreat	6	f
\.


--
-- Data for Name: user_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_feedback (id, user_id, profile_id, text, date) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, password, email, id, first_name, last_name, wishlist, join_date, birth_date, gender, country, phone_number, type, description) FROM stdin;
mbrewett6	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	mbrewett6@nydailynews.com	6	Marena	Brewett	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Welcome! I have a charming beachfront bungalow up for rent. It offers direct access to the beach and mesmerizing ocean views. Ideal for beach lovers and those looking for a beachside getaway.
whindrich7	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	whindrich7@netscape.com	7	Wenona	Hindrich	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hello travelers! I'm offering my modern city loft for rent. It's located in a trendy neighborhood with access to cafes, shops, and entertainment. Perfect for urban explorers seeking a stylish and vibrant stay.
scansfield5	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	scansfield5@fotki.com	5	Shandee	Cansfield	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hey adventurers! I have a secluded forest cabin available for rent. Live among the trees and connect with nature. It's a perfect spot for those seeking privacy and a unique off-grid experience. 
atutton8	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	atutton8@comsenz.com	8	Alberik	Tutton	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Greetings from the mountains! I'm renting out my mountain chalet with panoramic views. Experience the beauty of nature and unwind in this cozy retreat. Ideal for nature enthusiasts and mountain lovers.
administrator	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	admin@booking.com	1	Administrator	\N	{7,13}	2023-06-24	2005-06-26	\N	\N	\N	Host	Website administrator
smethringham2	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	smethringham2@unc.edu	2	Stacia	Methringham	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hello! I'm offering my cozy apartment for rent. It's a comfortable and well-furnished space with modern amenities. Perfect for solo travelers or couples seeking a convenient and pleasant stay in the city.
mlared3	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	mlared3@arizona.edu	3	Magda	Lared	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hi there! I have a beautiful countryside cottage available for rent. It's a peaceful retreat surrounded by nature, ideal for those seeking tranquility and relaxation. Enjoy the fresh air and stunning views!
cdrew4	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	cdrew4@wisc.edu	4	Clea	Drew	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Greetings! I'm renting out my spacious family house. It features multiple bedrooms, a large backyard, and a fully equipped kitchen. Perfect for families or groups looking for a homely and enjoyable vacation.
dclemmens9	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	dclemmens9@nasa.gov	9	Durante	Clemmens	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hi there! I'm offering my elegant townhouse for rent. It's located in a historic neighborhood with access to landmarks and cultural hotspots. Perfect for history enthusiasts and travelers seeking refinement.
mstycha	$2b$11$BaYvQoTQ.YfTK906XFFqxOP6sVsFdLctXi.hmDWT7uO89WrNw/Yke	mstycha@surveymonkey.com	10	Marlane	Stych	\N	2023-06-24	2005-06-26	\N	\N	\N	Host	Hello wanderers! I'm renting out my rustic farmhouse in the vineyards. Embrace the charm of the countryside and indulge in wine tastings. Ideal for wine enthusiasts and those looking for a peaceful retreat.
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 85, true);


--
-- Name: complains_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complains_id_seq', 38, true);


--
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 21, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 76, true);


--
-- Name: rental_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_properties_id_seq', 255, true);


--
-- Name: rental_properties_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_properties_user_id_seq', 1, true);


--
-- Name: user_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_feedback_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 128, true);


--
-- Name: conversations ID_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "ID_PK" PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: complains complains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complains
    ADD CONSTRAINT complains_pkey PRIMARY KEY (id);


--
-- Name: users id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT id_key PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: rental_properties rental_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_properties
    ADD CONSTRAINT rental_properties_pkey PRIMARY KEY (id);


--
-- Name: user_feedback user_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT user_feedback_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: fki_U; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_U" ON public.conversations USING btree (user1_id);


--
-- Name: fki_profile_id_PK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_profile_id_PK" ON public.user_feedback USING btree (profile_id);


--
-- Name: fki_user2_id_FK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_user2_id_FK" ON public.conversations USING btree (user2_id);


--
-- Name: fki_user_id_PK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_user_id_PK" ON public.user_feedback USING btree (user_id);


--
-- Name: messages conversation_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT conversation_id_fk FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- Name: user_feedback profile_id_PK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT "profile_id_PK" FOREIGN KEY (profile_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: complains rent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complains
    ADD CONSTRAINT rent_id FOREIGN KEY (rent_id) REFERENCES public.rental_properties(id);


--
-- Name: comments rent_repo_rent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT rent_repo_rent_id FOREIGN KEY (rent_id) REFERENCES public.rental_properties(id);


--
-- Name: rental_properties rent_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental_properties
    ADD CONSTRAINT rent_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: conversations user1_id_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "user1_id_FK" FOREIGN KEY (user1_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: conversations user2_id_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "user2_id_FK" FOREIGN KEY (user2_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: messages user_id_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "user_id_FK" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: complains user_id_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complains
    ADD CONSTRAINT "user_id_FK" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_feedback user_id_PK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT "user_id_PK" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- Name: comments users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT users_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

