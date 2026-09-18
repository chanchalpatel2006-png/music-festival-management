--
-- PostgreSQL database dump
--

\restrict ghLZggWvaBpgFQGKP0xlFn4fd8C1ESdbohHqMc9WfXKy1SOIBlYafiAtivbV5Cu

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artist_genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist_genre (
    artist_id character varying(5) NOT NULL,
    genre_id character varying(4) NOT NULL
);


ALTER TABLE public.artist_genre OWNER TO postgres;

--
-- Name: artist_member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist_member (
    member_id character varying(6) NOT NULL,
    artist_id character varying(5),
    member_name character varying(50) NOT NULL,
    instrument character varying(20)
);


ALTER TABLE public.artist_member OWNER TO postgres;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artists (
    artist_id character varying(5) NOT NULL,
    artist_name character varying(50) NOT NULL,
    artist_type character varying(4),
    country character varying(50) NOT NULL,
    manager_id character varying(5),
    CONSTRAINT artists_artist_type_check CHECK (((artist_type)::text = ANY ((ARRAY['SOLO'::character varying, 'BAND'::character varying])::text[])))
);


ALTER TABLE public.artists OWNER TO postgres;

--
-- Name: attendee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendee (
    attendee_id character varying(8) NOT NULL,
    attendee_name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    age integer NOT NULL,
    CONSTRAINT attendee_age_check CHECK ((age >= 15)),
    CONSTRAINT attendee_email_check CHECK (((email)::text ~~ '%@%'::text))
);


ALTER TABLE public.attendee OWNER TO postgres;

--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event (
    event_id character varying(6) NOT NULL,
    event_name character varying(50) NOT NULL,
    event_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    venue_id character varying(6) NOT NULL,
    CONSTRAINT event_check CHECK ((end_time > start_time))
);


ALTER TABLE public.event OWNER TO postgres;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    genre_id character varying(4) NOT NULL,
    genre_name character varying(50) NOT NULL
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- Name: manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manager (
    manager_id character varying(5) NOT NULL,
    manager_name character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50),
    CONSTRAINT manager_email_check CHECK (((email)::text ~~ '%@%'::text))
);


ALTER TABLE public.manager OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id character varying(8) NOT NULL,
    ticket_id character varying(8) NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date timestamp without time zone NOT NULL,
    payment_method character varying(20) NOT NULL,
    payment_status character varying(10) NOT NULL,
    CONSTRAINT payment_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT payment_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['UPI'::character varying, 'Net Banking'::character varying, 'Card'::character varying])::text[]))),
    CONSTRAINT payment_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['Refunded'::character varying, 'Pending'::character varying, 'Success'::character varying])::text[])))
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance (
    performance_id character varying(6) NOT NULL,
    event_id character varying(6) NOT NULL,
    artist_id character varying(5) NOT NULL,
    stage_id character varying(6) NOT NULL,
    performance_type character varying(20) NOT NULL,
    CONSTRAINT performance_performance_type_check CHECK (((performance_type)::text = ANY ((ARRAY['Main Act'::character varying, 'Opening Act'::character varying])::text[])))
);


ALTER TABLE public.performance OWNER TO postgres;

--
-- Name: setlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.setlist (
    setlist_id character varying(6) NOT NULL,
    performance_id character varying(6) NOT NULL
);


ALTER TABLE public.setlist OWNER TO postgres;

--
-- Name: setlist_song; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.setlist_song (
    setlist_id character varying(6) NOT NULL,
    song_id character varying(6) NOT NULL,
    song_order integer NOT NULL,
    CONSTRAINT setlist_song_song_order_check CHECK ((song_order > 0))
);


ALTER TABLE public.setlist_song OWNER TO postgres;

--
-- Name: song; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.song (
    song_id character varying(6) NOT NULL,
    song_name character varying(100) NOT NULL,
    artist_id character varying(5) NOT NULL
);


ALTER TABLE public.song OWNER TO postgres;

--
-- Name: sponsor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sponsor (
    sponsor_id character varying(6) NOT NULL,
    sponsor_name character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50) NOT NULL,
    sponsorship_type character varying(20) NOT NULL,
    sponsorship_tier character varying(20) NOT NULL,
    sponsorship_amount numeric(12,2),
    CONSTRAINT sponsor_email_check CHECK (((email)::text ~~ '%@%'::text)),
    CONSTRAINT sponsor_sponsorship_amount_check CHECK ((sponsorship_amount >= (0)::numeric)),
    CONSTRAINT sponsor_sponsorship_tier_check CHECK (((sponsorship_tier)::text = ANY ((ARRAY['Title'::character varying, 'Platinum'::character varying, 'Gold'::character varying, 'Silver'::character varying, 'Bronze'::character varying])::text[]))),
    CONSTRAINT sponsor_sponsorship_type_check CHECK (((sponsorship_type)::text = ANY ((ARRAY['Monetary'::character varying, 'Goods'::character varying, 'Services'::character varying])::text[])))
);


ALTER TABLE public.sponsor OWNER TO postgres;

--
-- Name: sponsor_demand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sponsor_demand (
    sponsor_id character varying(6) NOT NULL,
    demand_type character varying(30) NOT NULL,
    CONSTRAINT sponsor_demand_demand_type_check CHECK (((demand_type)::text = ANY ((ARRAY['Stall'::character varying, 'PR'::character varying, 'Banner'::character varying, 'Stage Branding'::character varying, 'Social Media Promotion'::character varying, 'Booth'::character varying, 'Logo Placement'::character varying])::text[])))
);


ALTER TABLE public.sponsor_demand OWNER TO postgres;

--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    staff_id character varying(6) NOT NULL,
    staff_name character varying(50) NOT NULL,
    role character varying(30) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50) NOT NULL,
    CONSTRAINT staff_email_check CHECK (((email)::text ~~ '%@%'::text)),
    CONSTRAINT staff_role_check CHECK (((role)::text = ANY ((ARRAY['Event Manager'::character varying, 'Event Coordinator'::character varying, 'Stage Manager'::character varying, 'Technical Staff'::character varying, 'Security Staff'::character varying, 'Medical Staff'::character varying, 'Hospitality Staff'::character varying, 'Volunteer'::character varying])::text[])))
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_assignment (
    assignment_id character varying(6) NOT NULL,
    staff_id character varying(6) NOT NULL,
    stage_id character varying(6),
    event_id character varying(6) NOT NULL,
    shift_start timestamp without time zone NOT NULL,
    shift_end timestamp without time zone NOT NULL,
    CONSTRAINT staff_assignment_check CHECK ((shift_end > shift_start))
);


ALTER TABLE public.staff_assignment OWNER TO postgres;

--
-- Name: stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stage (
    stage_id character varying(6) NOT NULL,
    stage_name character varying(50) NOT NULL,
    venue_id character varying(6) NOT NULL,
    capacity integer NOT NULL,
    stage_type character varying(20) NOT NULL,
    CONSTRAINT stage_capacity_check CHECK ((capacity > 0)),
    CONSTRAINT stage_stage_type_check CHECK (((stage_type)::text = ANY ((ARRAY['Main Stage'::character varying, 'Secondary Stage'::character varying, 'Open Air'::character varying, 'Indoor'::character varying, 'Amphitheatre'::character varying])::text[])))
);


ALTER TABLE public.stage OWNER TO postgres;

--
-- Name: stall; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stall (
    stall_id character varying(4) NOT NULL,
    vendor_id character varying(5) NOT NULL,
    stall_name character varying(50) NOT NULL,
    stall_type character varying(30) NOT NULL
);


ALTER TABLE public.stall OWNER TO postgres;

--
-- Name: stall_setup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stall_setup (
    setup_id character varying(6) NOT NULL,
    stall_id character varying(4) NOT NULL,
    venue_id character varying(6) NOT NULL,
    stall_rent numeric(10,2) NOT NULL,
    stall_date date NOT NULL,
    CONSTRAINT stall_setup_stall_rent_check CHECK ((stall_rent >= (0)::numeric))
);


ALTER TABLE public.stall_setup OWNER TO postgres;

--
-- Name: ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket (
    ticket_id character varying(8) NOT NULL,
    attendee_id character varying(8) NOT NULL,
    ticket_type_id character varying(4) NOT NULL,
    purchase_date date NOT NULL,
    entry_date date NOT NULL,
    ticket_status character varying(10) NOT NULL,
    CONSTRAINT ticket_ticket_status_check CHECK (((ticket_status)::text = ANY ((ARRAY['Used'::character varying, 'Active'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.ticket OWNER TO postgres;

--
-- Name: ticket_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_type (
    ticket_type_id character varying(4) NOT NULL,
    type_name character varying(50) NOT NULL,
    total_quantity integer NOT NULL,
    available integer NOT NULL,
    price numeric(10,2) NOT NULL,
    CONSTRAINT ticket_type_available_check CHECK ((available >= 0)),
    CONSTRAINT ticket_type_check CHECK ((available <= total_quantity)),
    CONSTRAINT ticket_type_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT ticket_type_total_quantity_check CHECK ((total_quantity > 0)),
    CONSTRAINT ticket_type_type_name_check CHECK (((type_name)::text = ANY ((ARRAY['VIP'::character varying, 'GENERAL'::character varying, 'STUDENT'::character varying])::text[])))
);


ALTER TABLE public.ticket_type OWNER TO postgres;

--
-- Name: vendor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor (
    vendor_id character varying(5) NOT NULL,
    vendor_name character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(50) NOT NULL,
    vendor_type character varying(20) NOT NULL,
    CONSTRAINT vendor_email_check CHECK (((email)::text ~~ '%@%'::text)),
    CONSTRAINT vendor_vendor_type_check CHECK (((vendor_type)::text = ANY ((ARRAY['Sponsor'::character varying, 'Business'::character varying])::text[])))
);


ALTER TABLE public.vendor OWNER TO postgres;

--
-- Name: venue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venue (
    venue_id character varying(6) NOT NULL,
    venue_name character varying(50) NOT NULL,
    location character varying(100) NOT NULL
);


ALTER TABLE public.venue OWNER TO postgres;

--
-- Name: artist_genre artist_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_genre
    ADD CONSTRAINT artist_genre_pkey PRIMARY KEY (artist_id, genre_id);


--
-- Name: artist_member artist_member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_member
    ADD CONSTRAINT artist_member_pkey PRIMARY KEY (member_id);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (artist_id);


--
-- Name: attendee attendee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendee
    ADD CONSTRAINT attendee_pkey PRIMARY KEY (attendee_id);


--
-- Name: event event_event_date_start_time_end_time_venue_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_event_date_start_time_end_time_venue_id_key UNIQUE (event_date, start_time, end_time, venue_id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);


--
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- Name: manager manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_pkey PRIMARY KEY (manager_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: performance performance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance
    ADD CONSTRAINT performance_pkey PRIMARY KEY (performance_id);


--
-- Name: setlist setlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT setlist_pkey PRIMARY KEY (setlist_id);


--
-- Name: setlist_song setlist_song_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist_song
    ADD CONSTRAINT setlist_song_pkey PRIMARY KEY (setlist_id, song_id);


--
-- Name: song song_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);


--
-- Name: sponsor_demand sponsor_demand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsor_demand
    ADD CONSTRAINT sponsor_demand_pkey PRIMARY KEY (sponsor_id, demand_type);


--
-- Name: sponsor sponsor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsor
    ADD CONSTRAINT sponsor_pkey PRIMARY KEY (sponsor_id);


--
-- Name: staff_assignment staff_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignment
    ADD CONSTRAINT staff_assignment_pkey PRIMARY KEY (assignment_id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (staff_id);


--
-- Name: stage stage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT stage_pkey PRIMARY KEY (stage_id);


--
-- Name: stall stall_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall
    ADD CONSTRAINT stall_pkey PRIMARY KEY (stall_id);


--
-- Name: stall_setup stall_setup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall_setup
    ADD CONSTRAINT stall_setup_pkey PRIMARY KEY (setup_id);


--
-- Name: stall_setup stall_setup_stall_id_venue_id_stall_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall_setup
    ADD CONSTRAINT stall_setup_stall_id_venue_id_stall_date_key UNIQUE (stall_id, venue_id, stall_date);


--
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (ticket_id);


--
-- Name: ticket_type ticket_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_type
    ADD CONSTRAINT ticket_type_pkey PRIMARY KEY (ticket_type_id);


--
-- Name: setlist unique_performance_setlist; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT unique_performance_setlist UNIQUE (performance_id);


--
-- Name: setlist_song unique_song_order; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist_song
    ADD CONSTRAINT unique_song_order UNIQUE (setlist_id, song_order);


--
-- Name: vendor vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (vendor_id);


--
-- Name: venue venue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venue
    ADD CONSTRAINT venue_pkey PRIMARY KEY (venue_id);


--
-- Name: artist_genre artist_genre_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_genre
    ADD CONSTRAINT artist_genre_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id);


--
-- Name: artist_genre artist_genre_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_genre
    ADD CONSTRAINT artist_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre(genre_id);


--
-- Name: artist_member artist_member_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_member
    ADD CONSTRAINT artist_member_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id);


--
-- Name: artists artists_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.manager(manager_id);


--
-- Name: event event_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venue(venue_id);


--
-- Name: payment payment_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.ticket(ticket_id);


--
-- Name: performance performance_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance
    ADD CONSTRAINT performance_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id);


--
-- Name: performance performance_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance
    ADD CONSTRAINT performance_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id);


--
-- Name: performance performance_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance
    ADD CONSTRAINT performance_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(stage_id);


--
-- Name: setlist setlist_performance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist
    ADD CONSTRAINT setlist_performance_id_fkey FOREIGN KEY (performance_id) REFERENCES public.performance(performance_id);


--
-- Name: setlist_song setlist_song_setlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist_song
    ADD CONSTRAINT setlist_song_setlist_id_fkey FOREIGN KEY (setlist_id) REFERENCES public.setlist(setlist_id);


--
-- Name: setlist_song setlist_song_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setlist_song
    ADD CONSTRAINT setlist_song_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.song(song_id);


--
-- Name: song song_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT song_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id);


--
-- Name: sponsor_demand sponsor_demand_sponsor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsor_demand
    ADD CONSTRAINT sponsor_demand_sponsor_id_fkey FOREIGN KEY (sponsor_id) REFERENCES public.sponsor(sponsor_id);


--
-- Name: staff_assignment staff_assignment_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignment
    ADD CONSTRAINT staff_assignment_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(event_id);


--
-- Name: staff_assignment staff_assignment_staff_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignment
    ADD CONSTRAINT staff_assignment_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);


--
-- Name: staff_assignment staff_assignment_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignment
    ADD CONSTRAINT staff_assignment_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.stage(stage_id);


--
-- Name: stage stage_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stage
    ADD CONSTRAINT stage_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venue(venue_id);


--
-- Name: stall_setup stall_setup_stall_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall_setup
    ADD CONSTRAINT stall_setup_stall_id_fkey FOREIGN KEY (stall_id) REFERENCES public.stall(stall_id);


--
-- Name: stall_setup stall_setup_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall_setup
    ADD CONSTRAINT stall_setup_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venue(venue_id);


--
-- Name: stall stall_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stall
    ADD CONSTRAINT stall_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendor(vendor_id);


--
-- Name: ticket ticket_attendee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_attendee_id_fkey FOREIGN KEY (attendee_id) REFERENCES public.attendee(attendee_id);


--
-- Name: ticket ticket_ticket_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_ticket_type_id_fkey FOREIGN KEY (ticket_type_id) REFERENCES public.ticket_type(ticket_type_id);


--
-- PostgreSQL database dump complete
--

\unrestrict ghLZggWvaBpgFQGKP0xlFn4fd8C1ESdbohHqMc9WfXKy1SOIBlYafiAtivbV5Cu

