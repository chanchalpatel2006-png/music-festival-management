const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

/* =========================================================
   BASIC
========================================================= */

app.get("/", (req, res) => {
    res.json({
        message: "Concert Management Backend Running",
        database: "concert_management"
    });
});


/* =========================================================
   TABLE CONFIGURATION
   These match your PostgreSQL database.
========================================================= */

const tables = {

    artists: {
        columns: [
            "artist_id",
            "artist_name",
            "artist_type",
            "country",
            "manager_id"
        ],
        primaryKey: ["artist_id"]
    },

    genre: {
        columns: [
            "genre_id",
            "genre_name"
        ],
        primaryKey: ["genre_id"]
    },

    manager: {
        columns: [
            "manager_id",
            "manager_name",
            "phone",
            "email"
        ],
        primaryKey: ["manager_id"]
    },

    artist_genre: {
        columns: [
            "artist_id",
            "genre_id"
        ],
        primaryKey: ["artist_id", "genre_id"]
    },

    artist_member: {
        columns: [
            "member_id",
            "artist_id",
            "member_name",
            "instrument"
        ],
        primaryKey: ["member_id"]
    },

    venue: {
        columns: [
            "venue_id",
            "venue_name",
            "location"
        ],
        primaryKey: ["venue_id"]
    },

    stage: {
        columns: [
            "stage_id",
            "stage_name",
            "venue_id",
            "capacity",
            "stage_type"
        ],
        primaryKey: ["stage_id"]
    },

    event: {
        columns: [
            "event_id",
            "event_name",
            "event_date",
            "start_time",
            "end_time",
            "venue_id"
        ],
        primaryKey: ["event_id"]
    },

    performance: {
        columns: [
            "performance_id",
            "event_id",
            "artist_id",
            "stage_id",
            "performance_type"
        ],
        primaryKey: ["performance_id"]
    },

    setlist: {
        columns: [
            "setlist_id",
            "performance_id"
        ],
        primaryKey: ["setlist_id"]
    },

    song: {
        columns: [
            "song_id",
            "song_name",
            "artist_id"
        ],
        primaryKey: ["song_id"]
    },

    setlist_song: {
        columns: [
            "setlist_id",
            "song_id",
            "song_order"
        ],
        primaryKey: ["setlist_id", "song_id"]
    },

    attendee: {
        columns: [
            "attendee_id",
            "attendee_name",
            "email",
            "phone",
            "age"
        ],
        primaryKey: ["attendee_id"]
    },

    ticket_type: {
        columns: [
            "ticket_type_id",
            "type_name",
            "total_quantity",
            "available",
            "price"
        ],
        primaryKey: ["ticket_type_id"]
    },

    ticket: {
        columns: [
            "ticket_id",
            "attendee_id",
            "ticket_type_id",
            "purchase_date",
            "entry_date",
            "ticket_status"
        ],
        primaryKey: ["ticket_id"]
    },

    payment: {
        columns: [
            "payment_id",
            "ticket_id",
            "amount",
            "payment_date",
            "payment_method",
            "payment_status"
        ],
        primaryKey: ["payment_id"]
    },

    sponsor: {
        columns: [
            "sponsor_id",
            "sponsor_name",
            "phone",
            "email",
            "sponsorship_type",
            "sponsorship_tier",
            "sponsorship_amount"
        ],
        primaryKey: ["sponsor_id"]
    },

    sponsor_demand: {
        columns: [
            "sponsor_id",
            "demand_type"
        ],
        primaryKey: ["sponsor_id", "demand_type"]
    },

    staff: {
        columns: [
            "staff_id",
            "staff_name",
            "role",
            "phone",
            "email"
        ],
        primaryKey: ["staff_id"]
    },

    staff_assignment: {
        columns: [
            "assignment_id",
            "staff_id",
            "stage_id",
            "event_id",
            "shift_start",
            "shift_end"
        ],
        primaryKey: ["assignment_id"]
    },

    vendor: {
        columns: [
            "vendor_id",
            "vendor_name",
            "phone",
            "email",
            "vendor_type"
        ],
        primaryKey: ["vendor_id"]
    },

    stall: {
        columns: [
            "stall_id",
            "vendor_id",
            "stall_name",
            "stall_type"
        ],
        primaryKey: ["stall_id"]
    },

    stall_setup: {
        columns: [
            "setup_id",
            "stall_id",
            "venue_id",
            "stall_rent",
            "stall_date"
        ],
        primaryKey: ["setup_id"]
    }
};


/* =========================================================
   GET ALL RECORDS

   Example:
   GET /api/artists
   GET /api/events
   GET /api/tickets
========================================================= */

app.get("/api/artists", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.artist_id,
                a.artist_name,
                a.artist_type,
                a.country,
                a.manager_id,
                m.manager_name
            FROM artists a
            LEFT JOIN manager m
                ON a.manager_id = m.manager_id
            ORDER BY a.artist_id
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch artists"
        });
    }
});


app.post("/api/artists", async (req, res) => {
    try {
        const {
            artist_id,
            artist_name,
            artist_type,
            country,
            manager_id
        } = req.body;

        const result = await pool.query(`
            INSERT INTO artists
                (artist_id, artist_name, artist_type, country, manager_id)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                artist_id,
                artist_name,
                artist_type,
                country,
                manager_id
        `, [
            artist_id,
            artist_name,
            artist_type,
            country,
            manager_id || null
        ]);

        const artist = result.rows[0];

        const managerResult = await pool.query(`
            SELECT manager_name
            FROM manager
            WHERE manager_id = $1
        `, [artist.manager_id]);

        artist.manager_name =
            managerResult.rows[0]?.manager_name || null;

        res.status(201).json(artist);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/artists", async (req, res) => {
    try {
        const {
            old_artist_id,
            artist_id,
            artist_name,
            artist_type,
            country,
            manager_id
        } = req.body;

        const result = await pool.query(`
            UPDATE artists
            SET
                artist_id = $1,
                artist_name = $2,
                artist_type = $3,
                country = $4,
                manager_id = $5
            WHERE artist_id = $6
            RETURNING
                artist_id,
                artist_name,
                artist_type,
                country,
                manager_id
        `, [
            artist_id,
            artist_name,
            artist_type,
            country,
            manager_id || null,
            old_artist_id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Artist not found"
            });
        }

        const artist = result.rows[0];

        const managerResult = await pool.query(`
            SELECT manager_name
            FROM manager
            WHERE manager_id = $1
        `, [artist.manager_id]);

        artist.manager_name =
            managerResult.rows[0]?.manager_name || null;

        res.json(artist);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/artist_member", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                am.member_id,
                am.artist_id,
                a.artist_name,
                am.member_name,
                am.instrument
            FROM artist_member am
            LEFT JOIN artists a
                ON am.artist_id = a.artist_id
            ORDER BY am.member_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch artist members"
        });

    }

});

app.post("/api/artist_member", async (req, res) => {

    try {

        const {
            member_id,
            artist_id,
            member_name,
            instrument
        } = req.body;


        const result = await pool.query(`
            INSERT INTO artist_member
                (member_id, artist_id, member_name, instrument)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                member_id,
                artist_id,
                member_name,
                instrument
        `, [
            member_id,
            artist_id,
            member_name,
            instrument || null
        ]);


        const member = result.rows[0];


        const artistResult = await pool.query(`
            SELECT artist_name
            FROM artists
            WHERE artist_id = $1
        `, [member.artist_id]);


        member.artist_name =
            artistResult.rows[0]?.artist_name || null;


        res.status(201).json(member);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/artist_member", async (req, res) => {

    try {

        const {
            old_member_id,
            member_id,
            artist_id,
            member_name,
            instrument
        } = req.body;


        const result = await pool.query(`
            UPDATE artist_member
            SET
                member_id = $1,
                artist_id = $2,
                member_name = $3,
                instrument = $4
            WHERE member_id = $5
            RETURNING
                member_id,
                artist_id,
                member_name,
                instrument
        `, [
            member_id,
            artist_id,
            member_name,
            instrument || null,
            old_member_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Artist member not found"
            });

        }


        const member = result.rows[0];


        const artistResult = await pool.query(`
            SELECT artist_name
            FROM artists
            WHERE artist_id = $1
        `, [member.artist_id]);


        member.artist_name =
            artistResult.rows[0]?.artist_name || null;


        res.json(member);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.get("/api/artist_genre", async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                ag.artist_id,
                a.artist_name,
                ag.genre_id,
                g.genre_name
            FROM artist_genre ag

            LEFT JOIN artists a
                ON ag.artist_id = a.artist_id

            LEFT JOIN genre g
                ON ag.genre_id = g.genre_id

            ORDER BY ag.artist_id, ag.genre_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch artist genres"
        });

    }
});

app.get("/api/venue", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                venue_id,
                venue_name,
                location
            FROM venue
            ORDER BY venue_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch venues"
        });

    }

});

app.post("/api/venue", async (req, res) => {

    try {

        const {
            venue_id,
            venue_name,
            location
        } = req.body;


        const result = await pool.query(`
            INSERT INTO venue
                (venue_id, venue_name, location)
            VALUES
                ($1, $2, $3)
            RETURNING
                venue_id,
                venue_name,
                location
        `, [
            venue_id,
            venue_name,
            location
        ]);


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to add venue"
        });

    }

});

app.put("/api/venue", async (req, res) => {

    try {

        const {
            old_venue_id,
            venue_id,
            venue_name,
            location
        } = req.body;


        const result = await pool.query(`
            UPDATE venue
            SET
                venue_id = $1,
                venue_name = $2,
                location = $3
            WHERE venue_id = $4
            RETURNING
                venue_id,
                venue_name,
                location
        `, [
            venue_id,
            venue_name,
            location,
            old_venue_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Venue not found"
            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to update venue"
        });

    }

});

app.delete("/api/venue/:id", async (req, res) => {

    try {

        const venueId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM venue
            WHERE venue_id = $1
            RETURNING venue_id
        `, [venueId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Venue not found"
            });

        }


        res.json({
            message: "Venue deleted successfully",
            venue_id: venueId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to delete venue"
        });

    }

});

app.get("/api/stage", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                s.stage_id,
                s.stage_name,
                s.venue_id,
                v.venue_name,
                s.capacity,
                s.stage_type
            FROM stage s
            LEFT JOIN venue v
                ON s.venue_id = v.venue_id
            ORDER BY s.stage_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch stages"
        });

    }

});

app.post("/api/stage", async (req, res) => {

    try {

        const {
            stage_id,
            stage_name,
            venue_id,
            capacity,
            stage_type
        } = req.body;


        const result = await pool.query(`
            INSERT INTO stage
                (
                    stage_id,
                    stage_name,
                    venue_id,
                    capacity,
                    stage_type
                )
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                stage_id,
                stage_name,
                venue_id,
                capacity,
                stage_type
        `, [
            stage_id,
            stage_name,
            venue_id,
            capacity,
            stage_type
        ]);


        const stage = result.rows[0];


        const venueResult = await pool.query(`
            SELECT venue_name
            FROM venue
            WHERE venue_id = $1
        `, [stage.venue_id]);


        stage.venue_name =
            venueResult.rows[0]?.venue_name || null;


        res.status(201).json(stage);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to add stage"
        });

    }

});

app.put("/api/stage", async (req, res) => {

    try {

        const {
            old_stage_id,
            stage_id,
            stage_name,
            venue_id,
            capacity,
            stage_type
        } = req.body;


        const result = await pool.query(`
            UPDATE stage
            SET
                stage_id = $1,
                stage_name = $2,
                venue_id = $3,
                capacity = $4,
                stage_type = $5
            WHERE stage_id = $6
            RETURNING
                stage_id,
                stage_name,
                venue_id,
                capacity,
                stage_type
        `, [
            stage_id,
            stage_name,
            venue_id,
            capacity,
            stage_type,
            old_stage_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Stage not found"
            });

        }


        const stage = result.rows[0];


        const venueResult = await pool.query(`
            SELECT venue_name
            FROM venue
            WHERE venue_id = $1
        `, [stage.venue_id]);


        stage.venue_name =
            venueResult.rows[0]?.venue_name || null;


        res.json(stage);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to update stage"
        });

    }

});

app.delete("/api/stage/:id", async (req, res) => {

    try {

        const stageId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM stage
            WHERE stage_id = $1
            RETURNING stage_id
        `, [stageId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Stage not found"
            });

        }


        res.json({
            message: "Stage deleted successfully",
            stage_id: stageId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to delete stage"
        });

    }

});


app.get("/api/song", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                s.song_id,
                s.song_name,
                s.artist_id,
                a.artist_name
            FROM song s
            LEFT JOIN artists a
                ON s.artist_id = a.artist_id
            ORDER BY s.song_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch songs"
        });

    }

});

app.get("/api/song", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                s.song_id,
                s.song_name,
                s.artist_id,
                a.artist_name
            FROM song s
            LEFT JOIN artists a
                ON s.artist_id = a.artist_id
            ORDER BY s.song_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch songs"
        });

    }

});

app.post("/api/song", async (req, res) => {

    try {

        const {
            song_id,
            song_name,
            artist_id
        } = req.body;


        const result = await pool.query(`
            INSERT INTO song
                (song_id, song_name, artist_id)
            VALUES
                ($1, $2, $3)
            RETURNING
                song_id,
                song_name,
                artist_id
        `, [
            song_id,
            song_name,
            artist_id
        ]);


        const song = result.rows[0];


        const artistResult = await pool.query(`
            SELECT artist_name
            FROM artists
            WHERE artist_id = $1
        `, [song.artist_id]);


        song.artist_name =
            artistResult.rows[0]?.artist_name || null;


        res.status(201).json(song);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to add song"
        });

    }

});


app.delete("/api/song/:id", async (req, res) => {

    try {

        const songId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM song
            WHERE song_id = $1
            RETURNING song_id
        `, [songId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Song not found"
            });

        }


        res.json({
            message: "Song deleted successfully",
            song_id: songId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to delete song"
        });

    }

});

app.get("/api/setlist-song", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                ss.setlist_id,
                ss.song_id,
                ss.song_order,
                s.song_name
            FROM setlist_song ss
            LEFT JOIN song s
                ON ss.song_id = s.song_id
            ORDER BY
                ss.setlist_id,
                ss.song_order
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch setlist songs"
        });

    }

});

app.post("/api/setlist-song", async (req, res) => {

    try {

        const {
            setlist_id,
            song_id,
            song_order
        } = req.body;


        const result = await pool.query(`
            INSERT INTO setlist_song
                (setlist_id, song_id, song_order)
            VALUES
                ($1, $2, $3)
            RETURNING
                setlist_id,
                song_id,
                song_order
        `, [
            setlist_id,
            song_id,
            song_order
        ]);


        const record = result.rows[0];


        const songResult = await pool.query(`
            SELECT song_name
            FROM song
            WHERE song_id = $1
        `, [record.song_id]);


        record.song_name =
            songResult.rows[0]?.song_name || null;


        res.status(201).json(record);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This song is already present in this setlist."
            });

        }

        res.status(500).json({
            error: "Failed to add setlist song"
        });

    }

});

app.put("/api/setlist-song", async (req, res) => {

    try {

        const {
            old_setlist_id,
            old_song_id,
            setlist_id,
            song_id,
            song_order
        } = req.body;


        const result = await pool.query(`
            UPDATE setlist_song
            SET
                setlist_id = $1,
                song_id = $2,
                song_order = $3
            WHERE
                setlist_id = $4
                AND song_id = $5
            RETURNING
                setlist_id,
                song_id,
                song_order
        `, [
            setlist_id,
            song_id,
            song_order,
            old_setlist_id,
            old_song_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Setlist song not found"
            });

        }


        const record = result.rows[0];


        const songResult = await pool.query(`
            SELECT song_name
            FROM song
            WHERE song_id = $1
        `, [record.song_id]);


        record.song_name =
            songResult.rows[0]?.song_name || null;


        res.json(record);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This song is already present in this setlist."
            });

        }

        res.status(500).json({
            error: "Failed to update setlist song"
        });

    }

});

app.delete(
    "/api/setlist-song/:setlistId/:songId",
    async (req, res) => {

        try {

            const {
                setlistId,
                songId
            } = req.params;


            const result = await pool.query(`
                DELETE FROM setlist_song
                WHERE
                    setlist_id = $1
                    AND song_id = $2
                RETURNING
                    setlist_id,
                    song_id
            `, [
                setlistId,
                songId
            ]);


            if (result.rows.length === 0) {

                return res.status(404).json({
                    error: "Setlist song not found"
                });

            }


            res.json({
                message:
                    "Setlist song deleted successfully",
                setlist_id: setlistId,
                song_id: songId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Failed to delete setlist song"
            });

        }

    }
);

app.get("/api/event", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                e.event_id,
                e.event_name,
                e.event_date,
                e.start_time,
                e.end_time,
                e.venue_id,
                v.venue_name
            FROM event e
            LEFT JOIN venue v
                ON e.venue_id = v.venue_id
            ORDER BY e.event_date, e.start_time
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch events"
        });

    }

});

app.post("/api/event", async (req, res) => {

    try {

        const {
            event_id,
            event_name,
            event_date,
            start_time,
            end_time,
            venue_id
        } = req.body;


        const result = await pool.query(`
            INSERT INTO event
                (
                    event_id,
                    event_name,
                    event_date,
                    start_time,
                    end_time,
                    venue_id
                )
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING
                event_id,
                event_name,
                event_date,
                start_time,
                end_time,
                venue_id
        `, [
            event_id,
            event_name,
            event_date,
            start_time,
            end_time,
            venue_id
        ]);


        const event = result.rows[0];


        const venueResult = await pool.query(`
            SELECT venue_name
            FROM venue
            WHERE venue_id = $1
        `, [event.venue_id]);


        event.venue_name =
            venueResult.rows[0]?.venue_name || null;


        res.status(201).json(event);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/event", async (req, res) => {

    try {

        const {
            old_event_id,
            event_id,
            event_name,
            event_date,
            start_time,
            end_time,
            venue_id
        } = req.body;


        const result = await pool.query(`
            UPDATE event
            SET
                event_id = $1,
                event_name = $2,
                event_date = $3,
                start_time = $4,
                end_time = $5,
                venue_id = $6
            WHERE event_id = $7
            RETURNING
                event_id,
                event_name,
                event_date,
                start_time,
                end_time,
                venue_id
        `, [
            event_id,
            event_name,
            event_date,
            start_time,
            end_time,
            venue_id,
            old_event_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Event not found"
            });

        }


        const event = result.rows[0];


        const venueResult = await pool.query(`
            SELECT venue_name
            FROM venue
            WHERE venue_id = $1
        `, [event.venue_id]);


        event.venue_name =
            venueResult.rows[0]?.venue_name || null;


        res.json(event);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.delete("/api/event/:id", async (req, res) => {

    try {

        const eventId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM event
            WHERE event_id = $1
            RETURNING event_id
        `, [eventId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Event not found"
            });

        }


        res.json({
            message: "Event deleted successfully",
            event_id: eventId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.get("/api/performance", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.performance_id,
                p.event_id,
                e.event_name,
                p.artist_id,
                a.artist_name,
                p.stage_id,
                s.stage_name,
                p.performance_type
            FROM performance p

            LEFT JOIN event e
                ON p.event_id = e.event_id

            LEFT JOIN artists a
                ON p.artist_id = a.artist_id

            LEFT JOIN stage s
                ON p.stage_id = s.stage_id

            ORDER BY p.performance_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch performances"
        });

    }

});

app.post("/api/performance", async (req, res) => {

    try {

        const {
            performance_id,
            event_id,
            artist_id,
            stage_id,
            performance_type
        } = req.body;


        const result = await pool.query(`
            INSERT INTO performance
            (
                performance_id,
                event_id,
                artist_id,
                stage_id,
                performance_type
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING
                performance_id,
                event_id,
                artist_id,
                stage_id,
                performance_type
        `, [
            performance_id,
            event_id,
            artist_id,
            stage_id,
            performance_type
        ]);


        const performance =
            result.rows[0];


        const names =
            await pool.query(`
                SELECT
                    e.event_name,
                    a.artist_name,
                    s.stage_name
                FROM event e

                CROSS JOIN artists a
                CROSS JOIN stage s

                WHERE e.event_id = $1
                AND a.artist_id = $2
                AND s.stage_id = $3
            `, [
                performance.event_id,
                performance.artist_id,
                performance.stage_id
            ]);


        if (names.rows.length > 0) {

            performance.event_name =
                names.rows[0].event_name;

            performance.artist_name =
                names.rows[0].artist_name;

            performance.stage_name =
                names.rows[0].stage_name;

        }


        res.status(201).json(performance);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/performance", async (req, res) => {

    try {

        const {
            old_performance_id,
            performance_id,
            event_id,
            artist_id,
            stage_id,
            performance_type
        } = req.body;


        const result = await pool.query(`
            UPDATE performance
            SET
                performance_id = $1,
                event_id = $2,
                artist_id = $3,
                stage_id = $4,
                performance_type = $5
            WHERE performance_id = $6
            RETURNING
                performance_id,
                event_id,
                artist_id,
                stage_id,
                performance_type
        `, [
            performance_id,
            event_id,
            artist_id,
            stage_id,
            performance_type,
            old_performance_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Performance not found"
            });

        }


        const performance =
            result.rows[0];


        const names =
            await pool.query(`
                SELECT
                    e.event_name,
                    a.artist_name,
                    s.stage_name
                FROM event e

                CROSS JOIN artists a
                CROSS JOIN stage s

                WHERE e.event_id = $1
                AND a.artist_id = $2
                AND s.stage_id = $3
            `, [
                performance.event_id,
                performance.artist_id,
                performance.stage_id
            ]);


        if (names.rows.length > 0) {

            performance.event_name =
                names.rows[0].event_name;

            performance.artist_name =
                names.rows[0].artist_name;

            performance.stage_name =
                names.rows[0].stage_name;

        }


        res.json(performance);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


app.get("/api/setlist", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                sl.setlist_id,
                sl.performance_id,
                p.performance_type,

                e.event_name,

                a.artist_name,

                s.stage_name

            FROM setlist sl

            LEFT JOIN performance p
                ON sl.performance_id =
                   p.performance_id

            LEFT JOIN event e
                ON p.event_id =
                   e.event_id

            LEFT JOIN artists a
                ON p.artist_id =
                   a.artist_id

            LEFT JOIN stage s
                ON p.stage_id =
                   s.stage_id

            ORDER BY sl.setlist_id
        `);


        const rows =
            result.rows.map(row => ({

                ...row,

                performance_id_display:
                    `${row.performance_id} - ${row.event_name ||
                    "Unknown Event"
                    } - ${row.artist_name ||
                    "Unknown Artist"
                    }`

            }));


        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch setlists"
        });

    }

});

app.post("/api/setlist", async (req, res) => {

    try {

        const {
            setlist_id,
            performance_id
        } = req.body;


        const result = await pool.query(`
            INSERT INTO setlist
            (
                setlist_id,
                performance_id
            )
            VALUES
            ($1, $2)
            RETURNING
                setlist_id,
                performance_id
        `, [
            setlist_id,
            performance_id
        ]);


        const setlist =
            result.rows[0];


        const performanceResult =
            await pool.query(`
                SELECT
                    p.performance_id,
                    p.performance_type,
                    e.event_name,
                    a.artist_name,
                    s.stage_name
                FROM performance p

                LEFT JOIN event e
                    ON p.event_id =
                       e.event_id

                LEFT JOIN artists a
                    ON p.artist_id =
                       a.artist_id

                LEFT JOIN stage s
                    ON p.stage_id =
                       s.stage_id

                WHERE p.performance_id = $1
            `, [setlist.performance_id]);


        const performance =
            performanceResult.rows[0];


        if (performance) {

            setlist.performance_id_display =
                `${performance.performance_id} - ${performance.event_name ||
                "Unknown Event"
                } - ${performance.artist_name ||
                "Unknown Artist"
                }`;

        }


        res.status(201).json(setlist);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This Setlist ID already exists."
            });

        }


        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Selected performance does not exist."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/setlist", async (req, res) => {

    try {

        const {
            old_setlist_id,
            setlist_id,
            performance_id
        } = req.body;


        const result = await pool.query(`
            UPDATE setlist
            SET
                setlist_id = $1,
                performance_id = $2
            WHERE setlist_id = $3
            RETURNING
                setlist_id,
                performance_id
        `, [
            setlist_id,
            performance_id,
            old_setlist_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Setlist not found"
            });

        }


        const setlist =
            result.rows[0];


        const performanceResult =
            await pool.query(`
                SELECT
                    p.performance_id,
                    p.performance_type,
                    e.event_name,
                    a.artist_name,
                    s.stage_name
                FROM performance p

                LEFT JOIN event e
                    ON p.event_id =
                       e.event_id

                LEFT JOIN artists a
                    ON p.artist_id =
                       a.artist_id

                LEFT JOIN stage s
                    ON p.stage_id =
                       s.stage_id

                WHERE p.performance_id = $1
            `, [setlist.performance_id]);


        const performance =
            performanceResult.rows[0];


        if (performance) {

            setlist.performance_id_display =
                `${performance.performance_id} - ${performance.event_name ||
                "Unknown Event"
                } - ${performance.artist_name ||
                "Unknown Artist"
                }`;

        }


        res.json(setlist);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This Setlist ID already exists."
            });

        }


        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Selected performance does not exist."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});

app.delete("/api/setlist/:id", async (req, res) => {

    try {

        const setlistId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM setlist
            WHERE setlist_id = $1
            RETURNING setlist_id
        `, [setlistId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Setlist not found"
            });

        }


        res.json({
            message:
                "Setlist deleted successfully",
            setlist_id:
                setlistId
        });

    } catch (error) {

        console.error(error);


        // Setlist may have songs in setlist_song
        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Cannot delete this setlist because songs are assigned to it."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});

app.delete("/api/performance/:id", async (req, res) => {

    try {

        const performanceId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM performance
            WHERE performance_id = $1
            RETURNING performance_id
        `, [performanceId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Performance not found"
            });

        }


        res.json({
            message:
                "Performance deleted successfully",
            performance_id:
                performanceId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.get("/api/attendee", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                attendee_id,
                attendee_name,
                email,
                phone,
                age
            FROM attendee
            ORDER BY attendee_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch attendees"
        });

    }

});

app.post("/api/attendee", async (req, res) => {

    try {

        const {
            attendee_id,
            attendee_name,
            email,
            phone,
            age
        } = req.body;


        const result = await pool.query(`
            INSERT INTO attendee
            (
                attendee_id,
                attendee_name,
                email,
                phone,
                age
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING
                attendee_id,
                attendee_name,
                email,
                phone,
                age
        `, [
            attendee_id,
            attendee_name,
            email,
            phone,
            age
        ]);


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "Attendee ID already exists."
            });

        }

        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/attendee", async (req, res) => {

    try {

        const {
            old_attendee_id,
            attendee_id,
            attendee_name,
            email,
            phone,
            age
        } = req.body;


        const result = await pool.query(`
            UPDATE attendee
            SET
                attendee_id = $1,
                attendee_name = $2,
                email = $3,
                phone = $4,
                age = $5
            WHERE attendee_id = $6
            RETURNING
                attendee_id,
                attendee_name,
                email,
                phone,
                age
        `, [
            attendee_id,
            attendee_name,
            email,
            phone,
            age,
            old_attendee_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Attendee not found"
            });

        }


        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "Attendee ID already exists."
            });

        }

        res.status(500).json({
            error: error.message
        });

    }

});

app.delete("/api/attendee/:id", async (req, res) => {

    try {

        const attendeeId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM attendee
            WHERE attendee_id = $1
            RETURNING attendee_id
        `, [attendeeId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Attendee not found"
            });

        }


        res.json({
            message:
                "Attendee deleted successfully",
            attendee_id:
                attendeeId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.get("/api/ticket-type", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                ticket_type_id,
                type_name,
                total_quantity,
                available,
                price
            FROM ticket_type
            ORDER BY ticket_type_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch ticket types"
        });

    }

});

app.get("/api/ticket", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                t.ticket_id,
                t.attendee_id,
                a.attendee_name,
                t.ticket_type_id,
                tt.type_name,
                t.purchase_date::text AS purchase_date,
                t.entry_date::text AS entry_date,
                t.ticket_status
            FROM ticket t

            LEFT JOIN attendee a
                ON t.attendee_id = a.attendee_id

            LEFT JOIN ticket_type tt
                ON t.ticket_type_id = tt.ticket_type_id

            ORDER BY t.ticket_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch tickets"
        });

    }

});

app.post("/api/ticket", async (req, res) => {

    try {

        const {
            ticket_id,
            attendee_id,
            ticket_type_id,
            purchase_date,
            entry_date,
            ticket_status
        } = req.body;


        const result = await pool.query(`
            INSERT INTO ticket
            (
                ticket_id,
                attendee_id,
                ticket_type_id,
                purchase_date,
                entry_date,
                ticket_status
            )
            VALUES
            ($1, $2, $3, $4, $5, $6)
            RETURNING
    ticket_id,
    attendee_id,
    ticket_type_id,
    purchase_date::text AS purchase_date,
    entry_date::text AS entry_date,
    ticket_status
        `, [
            ticket_id,
            attendee_id,
            ticket_type_id,
            purchase_date,
            entry_date,
            ticket_status
        ]);


        const ticket = result.rows[0];


        const names = await pool.query(`
            SELECT
                a.attendee_name,
                tt.type_name
            FROM attendee a
            CROSS JOIN ticket_type tt
            WHERE a.attendee_id = $1
              AND tt.ticket_type_id = $2
        `, [
            ticket.attendee_id,
            ticket.ticket_type_id
        ]);


        if (names.rows.length > 0) {

            ticket.attendee_name =
                names.rows[0].attendee_name;

            ticket.type_name =
                names.rows[0].type_name;

        }


        res.status(201).json(ticket);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Ticket ID already exists."
            });

        }

        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Selected attendee or ticket type does not exist."
            });

        }

        res.status(500).json({
            error: error.message
        });

    }

});

app.put("/api/ticket", async (req, res) => {

    try {

        const {
            old_ticket_id,
            ticket_id,
            attendee_id,
            ticket_type_id,
            purchase_date,
            entry_date,
            ticket_status
        } = req.body;


        const result = await pool.query(`
            UPDATE ticket
            SET
                ticket_id = $1,
                attendee_id = $2,
                ticket_type_id = $3,
                purchase_date = $4,
                entry_date = $5,
                ticket_status = $6
            WHERE ticket_id = $7
            RETURNING
    ticket_id,
    attendee_id,
    ticket_type_id,
    purchase_date::text AS purchase_date,
    entry_date::text AS entry_date,
    ticket_status
        `, [
            ticket_id,
            attendee_id,
            ticket_type_id,
            purchase_date,
            entry_date,
            ticket_status,
            old_ticket_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Ticket not found"
            });

        }


        const ticket = result.rows[0];


        const names = await pool.query(`
            SELECT
                a.attendee_name,
                tt.type_name
            FROM attendee a
            CROSS JOIN ticket_type tt
            WHERE a.attendee_id = $1
              AND tt.ticket_type_id = $2
        `, [
            ticket.attendee_id,
            ticket.ticket_type_id
        ]);


        if (names.rows.length > 0) {

            ticket.attendee_name =
                names.rows[0].attendee_name;

            ticket.type_name =
                names.rows[0].type_name;

        }


        res.json(ticket);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Ticket ID already exists."
            });

        }

        res.status(500).json({
            error: error.message
        });

    }

});

/* =========================================================
   PAYMENT ROUTES
========================================================= */


/* -----------------------------------------
   GET ALL PAYMENTS
----------------------------------------- */

app.get("/api/payment", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.payment_id,
                p.ticket_id,
                p.amount,
                TO_CHAR(
                    p.payment_date,
                    'YYYY-MM-DD"T"HH24:MI'
                ) AS payment_date,
                p.payment_method,
                p.payment_status
            FROM payment p
            ORDER BY p.payment_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch payments"
        });

    }

});


/* -----------------------------------------
   ADD PAYMENT
----------------------------------------- */

app.post("/api/payment", async (req, res) => {

    try {

        const {
            payment_id,
            ticket_id,
            amount,
            payment_date,
            payment_method,
            payment_status
        } = req.body;


        const result = await pool.query(`
            INSERT INTO payment
            (
                payment_id,
                ticket_id,
                amount,
                payment_date,
                payment_method,
                payment_status
            )
            VALUES
            ($1, $2, $3, $4, $5, $6)
            RETURNING
                payment_id,
                ticket_id,
                amount,
                TO_CHAR(
                    payment_date,
                    'YYYY-MM-DD"T"HH24:MI'
                ) AS payment_date,
                payment_method,
                payment_status
        `, [
            payment_id,
            ticket_id,
            amount,
            payment_date,
            payment_method,
            payment_status
        ]);


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error: "Payment ID already exists."
            });

        }


        if (error.code === "23503") {

            return res.status(400).json({
                error: "Selected ticket does not exist."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});


/* -----------------------------------------
   UPDATE PAYMENT
----------------------------------------- */

app.put("/api/payment", async (req, res) => {

    try {

        const {
            old_payment_id,
            payment_id,
            ticket_id,
            amount,
            payment_date,
            payment_method,
            payment_status
        } = req.body;


        const result = await pool.query(`
            UPDATE payment
            SET
                payment_id = $1,
                ticket_id = $2,
                amount = $3,
                payment_date = $4,
                payment_method = $5,
                payment_status = $6
            WHERE payment_id = $7
            RETURNING
                payment_id,
                ticket_id,
                amount,
                TO_CHAR(
                    payment_date,
                    'YYYY-MM-DD"T"HH24:MI'
                ) AS payment_date,
                payment_method,
                payment_status
        `, [
            payment_id,
            ticket_id,
            amount,
            payment_date,
            payment_method,
            payment_status,
            old_payment_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Payment not found"
            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error: "Payment ID already exists."
            });

        }


        if (error.code === "23503") {

            return res.status(400).json({
                error: "Selected ticket does not exist."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});


/* -----------------------------------------
   DELETE PAYMENT
----------------------------------------- */

app.delete("/api/payment/:id", async (req, res) => {

    try {

        const paymentId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM payment
            WHERE payment_id = $1
            RETURNING payment_id
        `, [paymentId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Payment not found"
            });

        }


        res.json({
            message: "Payment deleted successfully",
            payment_id: paymentId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.delete("/api/ticket/:id", async (req, res) => {

    try {

        const ticketId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM ticket
            WHERE ticket_id = $1
            RETURNING ticket_id
        `, [ticketId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Ticket not found"
            });

        }


        res.json({
            message: "Ticket deleted successfully",
            ticket_id: ticketId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.get("/api/:table", async (req, res) => {

    const tableName = req.params.table;
    const config = tables[tableName];

    if (!config) {
        return res.status(404).json({
            error: "Table not supported"
        });
    }

    try {

        const result = await pool.query(
            `SELECT * FROM "${tableName}" ORDER BY 1`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   GET ONE RECORD

   Works for tables having ONE primary key.

   Example:
   GET /api/artists/AR001
   GET /api/events/EV0001
========================================================= */

app.get("/api/:table/:id", async (req, res) => {

    const tableName = req.params.table;
    const config = tables[tableName];

    if (!config) {
        return res.status(404).json({
            error: "Table not supported"
        });
    }

    if (config.primaryKey.length !== 1) {
        return res.status(400).json({
            error: "This table has a composite primary key."
        });
    }

    try {

        const pk = config.primaryKey[0];

        const result = await pool.query(
            `SELECT * FROM "${tableName}" WHERE "${pk}" = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Record not found"
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   INSERT

   Example:

   POST /api/artists

   {
       "artist_id": "AR001",
       "artist_name": "ABC",
       "artist_type": "SOLO",
       "country": "India",
       "manager_id": "MG001"
   }
========================================================= */

app.post("/api/:table", async (req, res) => {

    const tableName = req.params.table;
    const config = tables[tableName];

    if (!config) {
        return res.status(404).json({
            error: "Table not supported"
        });
    }

    try {

        const fields = config.columns.filter(
            column => req.body[column] !== undefined
        );

        if (fields.length === 0) {

            return res.status(400).json({
                error: "No valid fields supplied"
            });

        }

        const values = fields.map(
            field => req.body[field]
        );

        const placeholders = fields.map(
            (_, index) => `$${index + 1}`
        );

        const query = `
            INSERT INTO "${tableName}"
            (${fields.map(f => `"${f}"`).join(", ")})
            VALUES (${placeholders.join(", ")})
            RETURNING *
        `;

        const result = await pool.query(
            query,
            values
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   UPDATE

   The primary key must be included in the request body.

   Example:

   PUT /api/artists

   {
       "artist_id": "AR001",
       "artist_name": "Updated Name",
       "artist_type": "SOLO",
       "country": "India",
       "manager_id": "MG001"
   }
========================================================= */

app.put("/api/:table", async (req, res) => {

    const tableName = req.params.table;
    const config = tables[tableName];

    if (!config) {
        return res.status(404).json({
            error: "Table not supported"
        });
    }

    try {

        const primaryKey = config.primaryKey;

        for (const key of primaryKey) {

            if (req.body[key] === undefined) {

                return res.status(400).json({
                    error: `Missing primary key: ${key}`
                });

            }
        }

        const updateFields = config.columns.filter(
            column =>
                !primaryKey.includes(column) &&
                req.body[column] !== undefined
        );

        if (updateFields.length === 0) {

            return res.status(400).json({
                error: "No fields to update"
            });

        }

        const values = [];
        const setParts = [];

        updateFields.forEach((field, index) => {

            values.push(req.body[field]);

            setParts.push(
                `"${field}" = $${index + 1}`
            );

        });


        const whereParts = [];

        primaryKey.forEach((key, index) => {

            values.push(req.body[key]);

            whereParts.push(
                `"${key}" = $${updateFields.length + index + 1}`
            );

        });


        const query = `
            UPDATE "${tableName}"
            SET ${setParts.join(", ")}
            WHERE ${whereParts.join(" AND ")}
            RETURNING *
        `;


        const result = await pool.query(
            query,
            values
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Record not found"
            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   DELETE

   Primary key values are supplied in the request body.

   Example:

   DELETE /api/artists

   {
       "artist_id": "AR001"
   }

   Composite example:

   DELETE /api/artist_genre

   {
       "artist_id": "AR001",
       "genre_id": "GR01"
   }
========================================================= */

app.delete("/api/:table", async (req, res) => {

    const tableName = req.params.table;
    const config = tables[tableName];

    if (!config) {
        return res.status(404).json({
            error: "Table not supported"
        });
    }

    try {

        const values = [];
        const whereParts = [];

        config.primaryKey.forEach((key, index) => {

            if (req.body[key] === undefined) {

                throw new Error(
                    `Missing primary key: ${key}`
                );

            }

            values.push(req.body[key]);

            whereParts.push(
                `"${key}" = $${index + 1}`
            );

        });


        const query = `
            DELETE FROM "${tableName}"
            WHERE ${whereParts.join(" AND ")}
            RETURNING *
        `;


        const result = await pool.query(
            query,
            values
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Record not found"
            });

        }


        res.json({
            message: "Record deleted",
            record: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   SPECIAL USER FRONTEND ROUTES
========================================================= */


/*
   USER EVENTS

   Returns events with venue and artist information.
*/

app.get("/api/user/events", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                e.event_id,
                e.event_name,
                e.event_date,
                e.start_time,
                e.end_time,
                v.venue_name,
                STRING_AGG(
                    DISTINCT a.artist_name,
                    ', '
                ) AS artists
            FROM event e

            JOIN venue v
                ON e.venue_id = v.venue_id

            LEFT JOIN performance p
                ON e.event_id = p.event_id

            LEFT JOIN artists a
                ON p.artist_id = a.artist_id

            GROUP BY
                e.event_id,
                e.event_name,
                e.event_date,
                e.start_time,
                e.end_time,
                v.venue_name

            ORDER BY e.event_date, e.start_time
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/*
   USER ARTISTS
*/

app.get("/api/user/artists", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                a.artist_id,
                a.artist_name,
                a.artist_type,
                a.country,
                STRING_AGG(
                    DISTINCT g.genre_name,
                    ', '
                ) AS genres
            FROM artists a

            LEFT JOIN artist_genre ag
                ON a.artist_id = ag.artist_id

            LEFT JOIN genre g
                ON ag.genre_id = g.genre_id

            GROUP BY
                a.artist_id,
                a.artist_name,
                a.artist_type,
                a.country

            ORDER BY a.artist_name
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/*
   AVAILABLE TICKET TYPES

   Used by booking page.
*/

app.get("/api/user/ticket-types", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                ticket_type_id,
                type_name,
                total_quantity,
                available,
                price
            FROM ticket_type
            WHERE available > 0
            ORDER BY price
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   COMPLETE BOOKING + PAYMENT

   This is the important route for:

   booking page
        ↓
   payment page
        ↓
   PostgreSQL

   It creates:

   1. attendee
   2. ticket
   3. payment

   and decreases ticket_type.available.

   All three happen inside ONE transaction.
========================================================= */

app.post("/api/bookings", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            event_id,
            ticket_type_id,
            attendee,
            payment_method
        } = req.body;


        if (
            !event_id ||
            !ticket_type_id ||
            !attendee ||
            !payment_method
        ) {

            return res.status(400).json({
                error: "Incomplete booking information"
            });

        }


        await client.query("BEGIN");


        /* -----------------------------------------
           FIND EVENT
        ----------------------------------------- */

        const eventResult = await client.query(
            `
            SELECT
    event_id,
    event_name,
    event_date::text AS event_date,
    start_time,
    end_time,
    venue_id
FROM event
WHERE event_id = $1
            `,
            [event_id]
        );


        if (eventResult.rows.length === 0) {

            throw new Error("Event not found");

        }


        const event = eventResult.rows[0];


        /* -----------------------------------------
           FIND TICKET TYPE
        ----------------------------------------- */

        const ticketResult = await client.query(
            `
            SELECT *
            FROM ticket_type
            WHERE ticket_type_id = $1
            FOR UPDATE
            `,
            [ticket_type_id]
        );


        if (ticketResult.rows.length === 0) {

            throw new Error("Ticket type not found");

        }


        const ticketType =
            ticketResult.rows[0];


        /* -----------------------------------------
           CHECK AVAILABILITY
        ----------------------------------------- */

        if (ticketType.available <= 0) {

            throw new Error(
                "No tickets available for this ticket type"
            );

        }


        /* -----------------------------------------
           GENERATE ATTENDEE ID
        ----------------------------------------- */

        const attendeeIdResult =
            await client.query(`
                SELECT
                    'AT' ||
                    LPAD(
                        (
                            COALESCE(
                                MAX(
                                    CAST(
                                        SUBSTRING(
                                            attendee_id
                                            FROM 3
                                        ) AS INTEGER
                                    )
                                ),
                                0
                            ) + 1
                        )::text,
                        6,
                        '0'
                    ) AS attendee_id
                FROM attendee
            `);


        const attendeeId =
            attendeeIdResult.rows[0].attendee_id;


        /* -----------------------------------------
           INSERT ATTENDEE
        ----------------------------------------- */

        await client.query(
            `
            INSERT INTO attendee
            (
                attendee_id,
                attendee_name,
                email,
                phone,
                age
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                attendeeId,
                attendee.name,
                attendee.email,
                attendee.phone,
                attendee.age
            ]
        );


        /* -----------------------------------------
           GENERATE TICKET ID
        ----------------------------------------- */

        const ticketIdResult =
            await client.query(`
                SELECT
                    'TK' ||
                    LPAD(
                        (
                            COALESCE(
                                MAX(
                                    CAST(
                                        SUBSTRING(
                                            ticket_id
                                            FROM 3
                                        ) AS INTEGER
                                    )
                                ),
                                0
                            ) + 1
                        )::text,
                        6,
                        '0'
                    ) AS ticket_id
                FROM ticket
            `);


        const ticketId =
            ticketIdResult.rows[0].ticket_id;


        /* -----------------------------------------
           INSERT TICKET
        ----------------------------------------- */

        await client.query(
            `
            INSERT INTO ticket
            (
                ticket_id,
                attendee_id,
                ticket_type_id,
                purchase_date,
                entry_date,
                ticket_status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_DATE,
                $4,
                'Active'
            )
            `,
            [
                ticketId,
                attendeeId,
                ticket_type_id,
                event.event_date
            ]
        );





        /* -----------------------------------------
           GENERATE PAYMENT ID
        ----------------------------------------- */

        const paymentIdResult =
            await client.query(`
                SELECT
                    'PM' ||
                    LPAD(
                        (
                            COALESCE(
                                MAX(
                                    CAST(
                                        SUBSTRING(
                                            payment_id
                                            FROM 3
                                        ) AS INTEGER
                                    )
                                ),
                                0
                            ) + 1
                        )::text,
                        6,
                        '0'
                    ) AS payment_id
                FROM payment
            `);


        const paymentId =
            paymentIdResult.rows[0].payment_id;


        /* -----------------------------------------
           INSERT PAYMENT
        ----------------------------------------- */

        await client.query(
            `
            INSERT INTO payment
            (
                payment_id,
                ticket_id,
                amount,
                payment_date,
                payment_method,
                payment_status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP,
                $4,
                'Success'
            )
            `,
            [
                paymentId,
                ticketId,
                ticketType.price,
                payment_method
            ]
        );


        /* -----------------------------------------
           COMMIT
        ----------------------------------------- */

        await client.query("COMMIT");


        res.status(201).json({

            message: "Booking successful",

            attendee_id: attendeeId,

            ticket_id: ticketId,

            payment_id: paymentId,

            event_id: event_id,

            ticket_type_id: ticket_type_id,

            amount: ticketType.price,

            ticket_status: "Active",

            payment_status: "Success"

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    } finally {

        client.release();

    }
});


/* =========================================================
   DASHBOARD / REPORT QUERIES
   Useful for staff pages and DBMS demonstration.
========================================================= */


/*
   Ticket + attendee information
*/

app.get("/api/reports/ticket-attendees", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                t.ticket_id,
                a.attendee_id,
                a.attendee_name,
                a.email,
                a.phone,
                a.age,
                tt.type_name AS ticket_type,
                tt.price,
                t.purchase_date,
                t.entry_date,
                t.ticket_status
            FROM ticket t

            INNER JOIN attendee a
                ON t.attendee_id = a.attendee_id

            INNER JOIN ticket_type tt
                ON t.ticket_type_id = tt.ticket_type_id

            ORDER BY t.ticket_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/*
   Payment report
*/

app.get("/api/reports/payments", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.payment_id,
                p.ticket_id,
                a.attendee_name,
                p.amount,
                p.payment_date,
                p.payment_method,
                p.payment_status
            FROM payment p

            INNER JOIN ticket t
                ON p.ticket_id = t.ticket_id

            INNER JOIN attendee a
                ON t.attendee_id = a.attendee_id

            ORDER BY p.payment_date DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/*
   Event + venue + performances
*/

app.get("/api/reports/events", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                e.event_id,
                e.event_name,
                e.event_date,
                e.start_time,
                e.end_time,
                v.venue_name,
                s.stage_name,
                a.artist_name,
                p.performance_type
            FROM event e

            INNER JOIN venue v
                ON e.venue_id = v.venue_id

            LEFT JOIN performance p
                ON e.event_id = p.event_id

            LEFT JOIN artists a
                ON p.artist_id = a.artist_id

            LEFT JOIN stage s
                ON p.stage_id = s.stage_id

            ORDER BY e.event_date, e.start_time
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});


/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {

    console.log(
        `Concert Management Backend running on http://localhost:${PORT}`
    );

});