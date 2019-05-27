--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 11.2

-- Started on 2019-05-27 02:14:43 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 199 (class 1259 OID 16457)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    email character varying NOT NULL,
    token character varying NOT NULL,
    frozen boolean NOT NULL,
    investor_pubk character varying NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16402)
-- Name: bankaccounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bankaccounts (
    seed character varying NOT NULL,
    pubk character varying NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.bankaccounts OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16449)
-- Name: investors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investors (
    pubk character varying NOT NULL,
    seed character varying NOT NULL
);


ALTER TABLE public.investors OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16410)
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    name character varying NOT NULL,
    issuer character varying NOT NULL,
    distributor character varying NOT NULL,
    amount bigint NOT NULL
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- TOC entry 2435 (class 0 OID 16457)
-- Dependencies: 199
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.accounts (email, token, frozen, investor_pubk) VALUES ('mati@gmail.com', 'RRR', false, 'GCUMD6XEWEQ76MFXZLNYABRE2COZOL7RN4IP4DSNDZ6UKR2VWFPVWGYQ');


--
-- TOC entry 2432 (class 0 OID 16402)
-- Dependencies: 196
-- Data for Name: bankaccounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bankaccounts (seed, pubk, name) VALUES ('SDZ2DIL3VTTO4FLOCPFIE74L7JDY2XQBIINZ75LNMLSQ2TDPXEDRW5UG', 'GAKE74CHW2M7ENLBN6NDOFQFGVMA76RZQGNARH7YGCGIHJJXT64P754G', 'issuerRRR');
INSERT INTO public.bankaccounts (seed, pubk, name) VALUES ('SCKHGEPCZOTUFDC2YPYHBIV3UQ6UWK37YHZD4XEAGJUABMMTAU3DEDX4', 'GBFXAJVYBWXB7RW53Y6UCDQT53VHXHJLMPK42ADENYBIDVL3FGJE7GDF', 'distributorRRR');


--
-- TOC entry 2434 (class 0 OID 16449)
-- Dependencies: 198
-- Data for Name: investors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.investors (pubk, seed) VALUES ('GCUMD6XEWEQ76MFXZLNYABRE2COZOL7RN4IP4DSNDZ6UKR2VWFPVWGYQ', 'SDOC6D5UPN7B3DB2HRC2S3DGRJREZCJN4KM74FT535SVQRR6RRKYVCAU');


--
-- TOC entry 2433 (class 0 OID 16410)
-- Dependencies: 197
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tokens (name, issuer, distributor, amount) VALUES ('BTC', 'XXXXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB', 'XXXX6USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7', 100);
INSERT INTO public.tokens (name, issuer, distributor, amount) VALUES ('ETH', 'YYYYHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB', 'YYYY6USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7', 1000);
INSERT INTO public.tokens (name, issuer, distributor, amount) VALUES ('RRR', 'GAKE74CHW2M7ENLBN6NDOFQFGVMA76RZQGNARH7YGCGIHJJXT64P754G', 'GBFXAJVYBWXB7RW53Y6UCDQT53VHXHJLMPK42ADENYBIDVL3FGJE7GDF', 1000);


--
-- TOC entry 2310 (class 2606 OID 16464)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (email, token);


--
-- TOC entry 2304 (class 2606 OID 16409)
-- Name: bankaccounts bankaccounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bankaccounts
    ADD CONSTRAINT bankaccounts_pkey PRIMARY KEY (name);


--
-- TOC entry 2308 (class 2606 OID 16456)
-- Name: investors investors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investors
    ADD CONSTRAINT investors_pkey PRIMARY KEY (pubk);


--
-- TOC entry 2306 (class 2606 OID 16417)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (name);


-- Completed on 2019-05-27 02:14:43 CEST

--
-- PostgreSQL database dump complete
--

