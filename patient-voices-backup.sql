--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diseases (
    id integer NOT NULL,
    api_id text NOT NULL,
    name text NOT NULL,
    description text
);


--
-- Name: diseases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.diseases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: diseases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.diseases_id_seq OWNED BY public.diseases.id;


--
-- Name: playing_with_neon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playing_with_neon (
    id integer NOT NULL,
    name text NOT NULL,
    value real
);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.playing_with_neon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.playing_with_neon_id_seq OWNED BY public.playing_with_neon.id;


--
-- Name: review_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_ratings (
    id integer NOT NULL,
    review_id integer,
    user_id integer,
    rating_value integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_ratings_rating_value_check CHECK ((rating_value = 1))
);


--
-- Name: review_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: review_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_ratings_id_seq OWNED BY public.review_ratings.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    disease_id integer,
    severity integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((severity >= 1) AND (severity <= 5)))
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255),
    country character varying(255),
    username character varying(100) DEFAULT ''::character varying NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: diseases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diseases ALTER COLUMN id SET DEFAULT nextval('public.diseases_id_seq'::regclass);


--
-- Name: playing_with_neon id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon ALTER COLUMN id SET DEFAULT nextval('public.playing_with_neon_id_seq'::regclass);


--
-- Name: review_ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_ratings ALTER COLUMN id SET DEFAULT nextval('public.review_ratings_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.diseases (id, api_id, name, description) FROM stdin;
1	covid-19	COVID-19	Respiratory illness caused by coronavirus
3	2129	Lung cancer	
4	2919	Prostate cancer	
\.


--
-- Data for Name: playing_with_neon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.playing_with_neon (id, name, value) FROM stdin;
1	c4ca4238a0	0.89901304
2	c81e728d9d	0.8005865
3	eccbc87e4b	0.78404367
4	a87ff679a2	0.019605178
5	e4da3b7fbb	0.58230346
6	1679091c5a	0.7952425
7	8f14e45fce	0.503169
8	c9f0f895fb	0.7001069
9	45c48cce2e	0.26148653
10	d3d9446802	0.2775027
\.


--
-- Data for Name: review_ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_ratings (id, review_id, user_id, rating_value, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, user_id, disease_id, severity, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, created_at, name, country, username) FROM stdin;
13	test@example.com	$2b$10$SA8yiF9ecPNY3epPLxxUT.u6/MGjSunjSRK.azrL6SxtbtaJ.WqfC	2025-05-18 18:57:43.637565	John Doe	USA	JD
\.


--
-- Name: diseases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.diseases_id_seq', 4, true);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.playing_with_neon_id_seq', 10, true);


--
-- Name: review_ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_ratings_id_seq', 3, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: diseases diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_pkey PRIMARY KEY (id);


--
-- Name: reviews one_review_per_user_disease; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT one_review_per_user_disease UNIQUE (user_id, disease_id);


--
-- Name: playing_with_neon playing_with_neon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon
    ADD CONSTRAINT playing_with_neon_pkey PRIMARY KEY (id);


--
-- Name: review_ratings review_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_ratings
    ADD CONSTRAINT review_ratings_pkey PRIMARY KEY (id);


--
-- Name: review_ratings review_ratings_review_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_ratings
    ADD CONSTRAINT review_ratings_review_id_user_id_key UNIQUE (review_id, user_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: reviews set_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: review_ratings review_ratings_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_ratings
    ADD CONSTRAINT review_ratings_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_ratings review_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_ratings
    ADD CONSTRAINT review_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

