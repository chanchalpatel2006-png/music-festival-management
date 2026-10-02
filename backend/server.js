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
/* ---------- MANAGER ROUTES ---------- */

// GET all managers (this was missing)
app.get("/api/manager", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT manager_id, manager_name, phone, email
            FROM manager
            ORDER BY manager_id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch managers" });
    }
});

// UPDATE manager (uses old_manager_id so the ID can be changed)
app.put("/api/manager", async (req, res) => {
    try {
        const { old_manager_id, manager_id, manager_name, phone, email } = req.body;

        const result = await pool.query(`
            UPDATE manager
            SET manager_id = $1, manager_name = $2, phone = $3, email = $4
            WHERE manager_id = $5
            RETURNING manager_id, manager_name, phone, email
        `, [manager_id, manager_name, phone, email || null, old_manager_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Manager not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE manager by URL id
app.delete("/api/manager/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM manager WHERE manager_id = $1 RETURNING manager_id`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Manager not found" });
        }
        res.json({ message: "Manager deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this manager because artists are assigned to them."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// DELETE artist by URL id
app.delete("/api/artists/:id", async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM artists WHERE artist_id = $1 RETURNING artist_id`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Artist not found" });
        }
        res.json({ message: "Artist deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this artist because it is used by another record."
            });
        }
        res.status(500).json({ error: error.message });
    }
});


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

/* =========================================================
   VENDOR ROUTES
========================================================= */


/* -----------------------------------------
   GET ALL VENDORS
----------------------------------------- */

app.get("/api/vendor", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                vendor_id,
                vendor_name,
                phone,
                email,
                vendor_type
            FROM vendor
            ORDER BY vendor_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch vendors"
        });

    }

});


/* -----------------------------------------
   ADD VENDOR
----------------------------------------- */

app.post("/api/vendor", async (req, res) => {

    try {

        const {
            vendor_id,
            vendor_name,
            phone,
            email,
            vendor_type
        } = req.body;


        const result = await pool.query(`
            INSERT INTO vendor
            (
                vendor_id,
                vendor_name,
                phone,
                email,
                vendor_type
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING
                vendor_id,
                vendor_name,
                phone,
                email,
                vendor_type
        `, [
            vendor_id,
            vendor_name,
            phone,
            email,
            vendor_type
        ]);


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error: "Vendor ID already exists."
            });

        }


        if (error.code === "23522") {

            return res.status(400).json({
                error: "Invalid vendor data."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});


/* -----------------------------------------
   UPDATE VENDOR
----------------------------------------- */

app.put("/api/vendor", async (req, res) => {

    try {

        const {
            old_vendor_id,
            vendor_id,
            vendor_name,
            phone,
            email,
            vendor_type
        } = req.body;


        const result = await pool.query(`
            UPDATE vendor
            SET
                vendor_id = $1,
                vendor_name = $2,
                phone = $3,
                email = $4,
                vendor_type = $5
            WHERE vendor_id = $6
            RETURNING
                vendor_id,
                vendor_name,
                phone,
                email,
                vendor_type
        `, [
            vendor_id,
            vendor_name,
            phone,
            email,
            vendor_type,
            old_vendor_id
        ]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Vendor not found"
            });

        }


        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error: "Vendor ID already exists."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});


/* -----------------------------------------
   DELETE VENDOR
----------------------------------------- */

app.delete("/api/vendor/:id", async (req, res) => {

    try {

        const vendorId =
            req.params.id;


        const result = await pool.query(`
            DELETE FROM vendor
            WHERE vendor_id = $1
            RETURNING vendor_id
        `, [vendorId]);


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Vendor not found"
            });

        }


        res.json({
            message:
                "Vendor deleted successfully",
            vendor_id:
                vendorId
        });

    } catch (error) {

        console.error(error);


        /*
           A vendor cannot be deleted if a stall
           is still using that vendor.
        */

        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Cannot delete this vendor because a stall is assigned to it."
            });

        }


        res.status(500).json({
            error: error.message
        });

    }

});

// ==================== STALL ROUTES ====================

// GET - Fetch all stalls
app.get("/api/stall", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT stall_id, vendor_id, stall_name, stall_type
            FROM stall
            ORDER BY stall_id
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// POST - Add a new stall
app.post("/api/stall", async (req, res) => {
    const { stall_id, vendor_id, stall_name, stall_type } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO stall
            (stall_id, vendor_id, stall_name, stall_type)
            VALUES ($1, $2, $3, $4)
            RETURNING stall_id, vendor_id, stall_name, stall_type
        `, [stall_id, vendor_id, stall_name, stall_type]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({
                error: "Stall ID already exists."
            });
        }

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Vendor ID does not exist."
            });
        }

        res.status(500).json({ error: err.message });
    }
});


// PUT - Update a stall
app.put("/api/stall", async (req, res) => {
    const {
        old_stall_id,
        stall_id,
        vendor_id,
        stall_name,
        stall_type
    } = req.body;

    try {
        const result = await pool.query(`
            UPDATE stall
            SET stall_id = $1,
                vendor_id = $2,
                stall_name = $3,
                stall_type = $4
            WHERE stall_id = $5
            RETURNING stall_id, vendor_id, stall_name, stall_type
        `, [
            stall_id,
            vendor_id,
            stall_name,
            stall_type,
            old_stall_id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Stall not found."
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({
                error: "Stall ID already exists."
            });
        }

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Vendor ID does not exist."
            });
        }

        res.status(500).json({ error: err.message });
    }
});


// DELETE - Delete a stall
app.delete("/api/stall/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM stall
            WHERE stall_id = $1
            RETURNING stall_id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Stall not found."
            });
        }

        res.json({
            message: "Stall deleted successfully."
        });

    } catch (err) {
        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this stall because it is being used by another record."
            });
        }

        res.status(500).json({ error: err.message });
    }
});

// ==================== STALL SETUP ROUTES ====================

// GET - Fetch all stall setups
app.get("/api/stall-setup", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                setup_id,
                stall_id,
                venue_id,
                stall_rent,
                stall_date::text AS stall_date
            FROM stall_setup
            ORDER BY setup_id
        `);

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});


// POST - Add a stall setup
app.post("/api/stall-setup", async (req, res) => {

    const {
        setup_id,
        stall_id,
        venue_id,
        stall_rent,
        stall_date
    } = req.body;

    try {

        const result = await pool.query(`
            INSERT INTO stall_setup
            (
                setup_id,
                stall_id,
                venue_id,
                stall_rent,
                stall_date
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                setup_id,
                stall_id,
                venue_id,
                stall_rent,
                stall_date::text AS stall_date
        `, [
            setup_id,
            stall_id,
            venue_id,
            stall_rent,
            stall_date
        ]);

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        // Duplicate primary key
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Setup ID already exists."
            });
        }

        // Foreign key violation
        if (err.code === "23503") {
            return res.status(400).json({
                error: "Invalid Stall ID or Venue ID."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});


// PUT - Update a stall setup
app.put("/api/stall-setup", async (req, res) => {

    const {
        old_setup_id,
        setup_id,
        stall_id,
        venue_id,
        stall_rent,
        stall_date
    } = req.body;

    try {

        const result = await pool.query(`
            UPDATE stall_setup
            SET
                setup_id = $1,
                stall_id = $2,
                venue_id = $3,
                stall_rent = $4,
                stall_date = $5
            WHERE setup_id = $6
            RETURNING
                setup_id,
                stall_id,
                venue_id,
                stall_rent,
                stall_date::text AS stall_date
        `, [
            setup_id,
            stall_id,
            venue_id,
            stall_rent,
            stall_date,
            old_setup_id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Stall setup not found."
            });
        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({
                error: "Setup ID already exists."
            });
        }

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Invalid Stall ID or Venue ID."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});


// DELETE - Delete a stall setup
app.delete("/api/stall-setup/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(`
            DELETE FROM stall_setup
            WHERE setup_id = $1
            RETURNING setup_id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Stall setup not found."
            });
        }

        res.json({
            message: "Stall setup deleted successfully."
        });

    } catch (err) {

        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this stall setup because it is referenced by another record."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});

// ==================== STAFF ROUTES ====================

// GET - Fetch all staff
app.get("/api/staff", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                staff_id,
                staff_name,
                role,
                phone,
                email
            FROM staff
            ORDER BY staff_id
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// POST - Add staff
app.post("/api/staff", async (req, res) => {

    const {
        staff_id,
        staff_name,
        role,
        phone,
        email
    } = req.body;

    try {

        const result = await pool.query(`
            INSERT INTO staff
            (
                staff_id,
                staff_name,
                role,
                phone,
                email
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                staff_id,
                staff_name,
                role,
                phone,
                email
        `, [
            staff_id,
            staff_name,
            role,
            phone,
            email
        ]);

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({
                error: "Staff ID already exists."
            });
        }

        if (err.code === "23514") {
            return res.status(400).json({
                error: "Invalid staff role."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});


// PUT - Update staff
app.put("/api/staff", async (req, res) => {

    const {
        old_staff_id,
        staff_id,
        staff_name,
        role,
        phone,
        email
    } = req.body;

    try {

        const result = await pool.query(`
            UPDATE staff
            SET
                staff_id = $1,
                staff_name = $2,
                role = $3,
                phone = $4,
                email = $5
            WHERE staff_id = $6
            RETURNING
                staff_id,
                staff_name,
                role,
                phone,
                email
        `, [
            staff_id,
            staff_name,
            role,
            phone,
            email,
            old_staff_id
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Staff member not found."
            });
        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        if (err.code === "23505") {
            return res.status(400).json({
                error: "Staff ID already exists."
            });
        }

        if (err.code === "23514") {
            return res.status(400).json({
                error: "Invalid staff role."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});


// DELETE - Delete staff
app.delete("/api/staff/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(`
            DELETE FROM staff
            WHERE staff_id = $1
            RETURNING staff_id
        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Staff member not found."
            });
        }

        res.json({
            message: "Staff deleted successfully."
        });

    } catch (err) {

        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this staff member because it is referenced by another record."
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});

// ===============================
// STAFF ASSIGNMENT
// ===============================

app.get("/api/staff-assignment", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                assignment_id,
                staff_id,
                stage_id,
                event_id,
                shift_start::text AS shift_start,
                shift_end::text AS shift_end
            FROM staff_assignment
            ORDER BY assignment_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load staff assignments."
        });
    }
});


app.post("/api/staff-assignment", async (req, res) => {

    const {
        assignment_id,
        staff_id,
        stage_id,
        event_id,
        shift_start,
        shift_end
    } = req.body;

    try {

        const result = await pool.query(`
            INSERT INTO staff_assignment
            (
                assignment_id,
                staff_id,
                stage_id,
                event_id,
                shift_start,
                shift_end
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                assignment_id,
                staff_id,
                stage_id,
                event_id,
                shift_start::text AS shift_start,
                shift_end::text AS shift_end
        `, [
            assignment_id,
            staff_id,
            stage_id || null,
            event_id,
            shift_start,
            shift_end
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Assignment ID already exists."
            });
        }

        if (error.code === "23503") {

            return res.status(400).json({
                error: "Invalid Staff, Stage, or Event selected."
            });
        }

        if (error.code === "23514") {

            return res.status(400).json({
                error: "Shift End must be after Shift Start."
            });
        }

        res.status(500).json({
            error: "Unable to create staff assignment."
        });
    }
});


app.put("/api/staff-assignment", async (req, res) => {

    const {
        old_assignment_id,
        assignment_id,
        staff_id,
        stage_id,
        event_id,
        shift_start,
        shift_end
    } = req.body;

    try {

        const result = await pool.query(`
            UPDATE staff_assignment
            SET
                assignment_id = $1,
                staff_id = $2,
                stage_id = $3,
                event_id = $4,
                shift_start = $5,
                shift_end = $6
            WHERE assignment_id = $7
            RETURNING
                assignment_id,
                staff_id,
                stage_id,
                event_id,
                shift_start::text AS shift_start,
                shift_end::text AS shift_end
        `, [
            assignment_id,
            staff_id,
            stage_id || null,
            event_id,
            shift_start,
            shift_end,
            old_assignment_id
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Staff assignment not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Assignment ID already exists."
            });
        }

        if (error.code === "23503") {

            return res.status(400).json({
                error: "Invalid Staff, Stage, or Event selected."
            });
        }

        if (error.code === "23514") {

            return res.status(400).json({
                error: "Shift End must be after Shift Start."
            });
        }

        res.status(500).json({
            error: "Unable to update staff assignment."
        });
    }
});


app.delete("/api/staff-assignment/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(`
            DELETE FROM staff_assignment
            WHERE assignment_id = $1
            RETURNING assignment_id
        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Staff assignment not found."
            });
        }

        res.json({
            message: "Staff assignment deleted successfully."
        });

    } catch (error) {

        console.error(error);

        if (error.code === "23503") {

            return res.status(400).json({
                error: "Unable to delete this assignment."
            });
        }

        res.status(500).json({
            error: "Unable to delete staff assignment."
        });
    }
});

app.get("/api/event/:event_id/stages", async (req, res) => {

    const { event_id } = req.params;

    try {

        const result = await pool.query(`
            SELECT DISTINCT
                s.stage_id,
                s.stage_name
            FROM performance p
            JOIN stage s
                ON p.stage_id = s.stage_id
            WHERE p.event_id = $1
            ORDER BY s.stage_id
        `, [event_id]);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load stages for this event."
        });
    }
});
app.get("/api/stage/:stage_id/events", async (req, res) => {

    const { stage_id } = req.params;

    try {

        const result = await pool.query(`
            SELECT DISTINCT
                e.event_id,
                e.event_name
            FROM performance p
            JOIN event e
                ON p.event_id = e.event_id
            WHERE p.stage_id = $1
            ORDER BY e.event_id
        `, [stage_id]);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load events for this stage."
        });
    }
});


// ===============================
// SPONSOR
// ===============================

app.get("/api/sponsor", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                sponsor_id,
                sponsor_name,
                phone,
                email,
                sponsorship_type,
                sponsorship_tier,
                sponsorship_amount
            FROM sponsor
            ORDER BY sponsor_id
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load sponsors."
        });
    }
});


app.post("/api/sponsor", async (req, res) => {

    const {
        sponsor_id,
        sponsor_name,
        phone,
        email,
        sponsorship_type,
        sponsorship_tier,
        sponsorship_amount
    } = req.body;

    try {

        const result = await pool.query(`
            INSERT INTO sponsor
            (
                sponsor_id,
                sponsor_name,
                phone,
                email,
                sponsorship_type,
                sponsorship_tier,
                sponsorship_amount
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            sponsor_id,
            sponsor_name,
            phone,
            email,
            sponsorship_type,
            sponsorship_tier,
            sponsorship_amount === "" ||
                sponsorship_amount === undefined
                ? null
                : sponsorship_amount
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);


        // Duplicate sponsor ID

        if (error.code === "23505") {

            return res.status(400).json({
                error: "Sponsor ID already exists."
            });
        }


        // CHECK constraint violation

        if (error.code === "23514") {

            return res.status(400).json({
                error:
                    "Invalid sponsorship type, tier, email, or amount."
            });
        }


        res.status(500).json({
            error: "Unable to create sponsor."
        });
    }
});


app.put("/api/sponsor", async (req, res) => {

    const {
        old_sponsor_id,
        sponsor_id,
        sponsor_name,
        phone,
        email,
        sponsorship_type,
        sponsorship_tier,
        sponsorship_amount
    } = req.body;

    try {

        const result = await pool.query(`
            UPDATE sponsor
            SET
                sponsor_id = $1,
                sponsor_name = $2,
                phone = $3,
                email = $4,
                sponsorship_type = $5,
                sponsorship_tier = $6,
                sponsorship_amount = $7
            WHERE sponsor_id = $8
            RETURNING *
        `, [
            sponsor_id,
            sponsor_name,
            phone,
            email,
            sponsorship_type,
            sponsorship_tier,
            sponsorship_amount === "" ||
                sponsorship_amount === undefined
                ? null
                : sponsorship_amount,
            old_sponsor_id
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Sponsor not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error: "Sponsor ID already exists."
            });
        }


        if (error.code === "23514") {

            return res.status(400).json({
                error:
                    "Invalid sponsorship type, tier, email, or amount."
            });
        }


        res.status(500).json({
            error: "Unable to update sponsor."
        });
    }
});


app.delete("/api/sponsor/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(`
            DELETE FROM sponsor
            WHERE sponsor_id = $1
            RETURNING sponsor_id
        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Sponsor not found."
            });
        }

        res.json({
            message: "Sponsor deleted successfully."
        });

    } catch (error) {

        console.error(error);


        // In case another table later references Sponsor

        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Cannot delete this sponsor because it is being used by another record."
            });
        }


        res.status(500).json({
            error: "Unable to delete sponsor."
        });
    }
});

// ===============================
// SPONSOR DEMAND
// ===============================

app.get("/api/sponsor-demand", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                sponsor_id,
                demand_type
            FROM sponsor_demand
            ORDER BY sponsor_id, demand_type
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load sponsor demands."
        });
    }
});


app.post("/api/sponsor-demand", async (req, res) => {

    const {
        sponsor_id,
        demand_type
    } = req.body;

    try {

        const result = await pool.query(`
            INSERT INTO sponsor_demand
            (
                sponsor_id,
                demand_type
            )
            VALUES ($1, $2)
            RETURNING
                sponsor_id,
                demand_type
        `, [
            sponsor_id,
            demand_type
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);


        // Duplicate composite primary key

        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This sponsor already has this demand type."
            });
        }


        // Foreign key violation, if your database
        // later adds FK sponsor_id → sponsor

        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Selected sponsor does not exist."
            });
        }


        // CHECK constraint

        if (error.code === "23514") {

            return res.status(400).json({
                error:
                    "Invalid demand type."
            });
        }


        res.status(500).json({
            error: "Unable to create sponsor demand."
        });
    }
});


app.put("/api/sponsor-demand", async (req, res) => {

    const {
        old_sponsor_id,
        old_demand_type,
        sponsor_id,
        demand_type
    } = req.body;

    try {

        const result = await pool.query(`
            UPDATE sponsor_demand
            SET
                sponsor_id = $1,
                demand_type = $2
            WHERE
                sponsor_id = $3
                AND demand_type = $4
            RETURNING
                sponsor_id,
                demand_type
        `, [
            sponsor_id,
            demand_type,
            old_sponsor_id,
            old_demand_type
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Sponsor demand not found."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);


        if (error.code === "23505") {

            return res.status(400).json({
                error:
                    "This sponsor already has this demand type."
            });
        }


        if (error.code === "23503") {

            return res.status(400).json({
                error:
                    "Selected sponsor does not exist."
            });
        }


        if (error.code === "23514") {

            return res.status(400).json({
                error:
                    "Invalid demand type."
            });
        }


        res.status(500).json({
            error: "Unable to update sponsor demand."
        });
    }
});


app.delete(
    "/api/sponsor-demand/:sponsor_id/:demand_type",
    async (req, res) => {

        const {
            sponsor_id,
            demand_type
        } = req.params;

        try {

            const result = await pool.query(`
                DELETE FROM sponsor_demand
                WHERE
                    sponsor_id = $1
                    AND demand_type = $2
                RETURNING
                    sponsor_id,
                    demand_type
            `, [
                sponsor_id,
                demand_type
            ]);

            if (result.rows.length === 0) {

                return res.status(404).json({
                    error:
                        "Sponsor demand not found."
                });
            }

            res.json({
                message:
                    "Sponsor demand deleted successfully."
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error:
                    "Unable to delete sponsor demand."
            });
        }
    }
);

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
            event_date,
            ticket_type_id,
            attendee,
            payment_method
        } = req.body;


        // Basic validation

        if (
            !event_date ||
            !ticket_type_id ||
            !attendee ||
            !payment_method
        ) {

            return res.status(400).json({
                error: "Incomplete booking information"
            });

        }


        if (
            !attendee.name ||
            !attendee.email ||
            !attendee.phone ||
            attendee.age === undefined
        ) {

            return res.status(400).json({
                error: "Incomplete attendee information"
            });

        }


        // Allowed festival dates

        const allowedDates = [
            "2026-12-20",
            "2026-12-21",
            "2026-12-22"
        ];


        if (!allowedDates.includes(event_date)) {

            return res.status(400).json({
                error: "Invalid festival date."
            });

        }


        await client.query("BEGIN");


        // Get ticket type and lock the row

        const ticketResult = await client.query(
            `
            SELECT
                ticket_type_id,
                type_name,
                total_quantity,
                available,
                price
            FROM ticket_type
            WHERE ticket_type_id = $1
            FOR UPDATE
            `,
            [ticket_type_id]
        );


        if (ticketResult.rows.length === 0) {

            throw new Error("Ticket type not found.");

        }


        const ticketType = ticketResult.rows[0];


        if (ticketType.available <= 0) {

            throw new Error(
                "No tickets available for this ticket type."
            );

        }


        // Reduce available tickets

        await client.query(
            `
            UPDATE ticket_type
            SET available = available - 1
            WHERE ticket_type_id = $1
            `,
            [ticket_type_id]
        );


        // --------------------------------
        // Find existing attendee
        // --------------------------------

        const existingAttendee = await client.query(
            `
    SELECT attendee_id
    FROM attendee
    WHERE email = $1
      AND phone = $2
    LIMIT 1
    `,
            [
                attendee.email,
                attendee.phone
            ]
        );


        let attendeeId;


        // Existing attendee found

        if (existingAttendee.rows.length > 0) {

            attendeeId =
                existingAttendee.rows[0].attendee_id;

        }


        // New attendee

        else {

            const attendeeResult = await client.query(
                `
        SELECT attendee_id
        FROM attendee
        WHERE attendee_id LIKE 'AT%'
        ORDER BY attendee_id DESC
        LIMIT 1
        `
            );


            let attendeeNumber = 1;


            if (attendeeResult.rows.length > 0) {

                const lastId =
                    attendeeResult.rows[0].attendee_id;

                attendeeNumber =
                    parseInt(lastId.substring(2), 10) + 1;

            }


            attendeeId =
                "AT" +
                String(attendeeNumber).padStart(6, "0");


            await client.query(
                `
        INSERT INTO attendee
        (
            attendee_id,
            attendee_name,
            age,
            email,
            phone
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
                [
                    attendeeId,
                    attendee.name,
                    attendee.age,
                    attendee.email,
                    attendee.phone
                ]
            );

        }

        // --------------------------------
        // Generate Ticket ID
        // --------------------------------

        const ticketResultId = await client.query(
            `
            SELECT ticket_id
            FROM ticket
            WHERE ticket_id LIKE 'TK%'
            ORDER BY ticket_id DESC
            LIMIT 1
            `
        );


        let ticketNumber = 1;


        if (ticketResultId.rows.length > 0) {

            const lastId =
                ticketResultId.rows[0].ticket_id;

            ticketNumber =
                parseInt(lastId.substring(2), 10) + 1;

        }


        const ticketId =
            "TK" +
            String(ticketNumber).padStart(6, "0");


        // Insert ticket

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
                event_date
            ]
        );


        // --------------------------------
        // Generate Payment ID
        // --------------------------------

        const paymentResultId = await client.query(
            `
            SELECT payment_id
            FROM payment
            WHERE payment_id LIKE 'PM%'
            ORDER BY payment_id DESC
            LIMIT 1
            `
        );


        let paymentNumber = 1;


        if (paymentResultId.rows.length > 0) {

            const lastId =
                paymentResultId.rows[0].payment_id;

            paymentNumber =
                parseInt(lastId.substring(2), 10) + 1;

        }


        const paymentId =
            "PM" +
            String(paymentNumber).padStart(6, "0");


        // Insert payment

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


        await client.query("COMMIT");


        res.status(201).json({

            message: "Booking successful",

            attendee_id: attendeeId,

            ticket_id: ticketId,

            payment_id: paymentId,

            event_date: event_date,

            ticket_type_id: ticket_type_id,

            ticket_type: ticketType.type_name,

            amount: ticketType.price,

            ticket_status: "Active",

            payment_status: "Success"

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error("BOOKING ERROR:", error);

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
   GENRE ROUTES  (genre_id VARCHAR(4))
========================================================= */

app.get("/api/genre", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT genre_id, genre_name
            FROM genre
            ORDER BY genre_id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch genres" });
    }
});

app.post("/api/genre", async (req, res) => {
    try {
        const { genre_id, genre_name } = req.body;

        const result = await pool.query(`
            INSERT INTO genre (genre_id, genre_name)
            VALUES ($1, $2)
            RETURNING genre_id, genre_name
        `, [genre_id, genre_name]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({ error: "Genre ID already exists." });
        }
        if (error.code === "22001") {
            return res.status(400).json({ error: "Genre ID can be at most 4 characters." });
        }
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/genre", async (req, res) => {
    try {
        const { old_genre_id, genre_id, genre_name } = req.body;

        const result = await pool.query(`
            UPDATE genre
            SET genre_id = $1, genre_name = $2
            WHERE genre_id = $3
            RETURNING genre_id, genre_name
        `, [genre_id, genre_name, old_genre_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({ error: "Genre ID already exists." });
        }
        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot change this Genre ID because artists are linked to it."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/genre/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            DELETE FROM genre
            WHERE genre_id = $1
            RETURNING genre_id
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.json({ message: "Genre deleted successfully", genre_id: req.params.id });
    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this genre because artists are linked to it."
            });
        }
        res.status(500).json({ error: error.message });
    }
});


/* =========================================================
   TICKET TYPE ROUTES  (GET already exists above)
========================================================= */

app.post("/api/ticket-type", async (req, res) => {
    try {
        const {
            ticket_type_id,
            type_name,
            total_quantity,
            available,
            price
        } = req.body;

        const result = await pool.query(`
            INSERT INTO ticket_type
                (ticket_type_id, type_name, total_quantity, available, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ticket_type_id, type_name, total_quantity, available, price
        `, [ticket_type_id, type_name, total_quantity, available, price]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({ error: "Ticket Type ID already exists." });
        }
        if (error.code === "23514") {
            return res.status(400).json({
                error: "Invalid ticket type. Name must be VIP, GENERAL or STUDENT; quantities must be valid and available cannot exceed total."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/ticket-type", async (req, res) => {
    try {
        const {
            old_ticket_type_id,
            ticket_type_id,
            type_name,
            total_quantity,
            available,
            price
        } = req.body;

        const result = await pool.query(`
            UPDATE ticket_type
            SET
                ticket_type_id = $1,
                type_name = $2,
                total_quantity = $3,
                available = $4,
                price = $5
            WHERE ticket_type_id = $6
            RETURNING ticket_type_id, type_name, total_quantity, available, price
        `, [
            ticket_type_id,
            type_name,
            total_quantity,
            available,
            price,
            old_ticket_type_id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket type not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({ error: "Ticket Type ID already exists." });
        }
        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot change this ID because tickets use this ticket type."
            });
        }
        if (error.code === "23514") {
            return res.status(400).json({
                error: "Invalid ticket type. Name must be VIP, GENERAL or STUDENT; quantities must be valid and available cannot exceed total."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/ticket-type/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            DELETE FROM ticket_type
            WHERE ticket_type_id = $1
            RETURNING ticket_type_id
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket type not found" });
        }
        res.json({
            message: "Ticket type deleted successfully",
            ticket_type_id: req.params.id
        });
    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                error: "Cannot delete this ticket type because tickets have been sold with it."
            });
        }
        res.status(500).json({ error: error.message });
    }
});


/* =========================================================
   ARTIST GENRE ROUTES  (GET already exists above)
   The table has no primary key, so duplicates are
   checked manually.
========================================================= */

app.post("/api/artist_genre", async (req, res) => {
    try {
        const { artist_id, genre_id } = req.body;

        const exists = await pool.query(`
            SELECT 1 FROM artist_genre
            WHERE artist_id = $1 AND genre_id = $2
        `, [artist_id, genre_id]);

        if (exists.rows.length > 0) {
            return res.status(400).json({
                error: "This artist already has this genre."
            });
        }

        await pool.query(`
            INSERT INTO artist_genre (artist_id, genre_id)
            VALUES ($1, $2)
        `, [artist_id, genre_id]);

        const names = await pool.query(`
            SELECT
                ag.artist_id,
                a.artist_name,
                ag.genre_id,
                g.genre_name
            FROM artist_genre ag
            LEFT JOIN artists a ON ag.artist_id = a.artist_id
            LEFT JOIN genre g ON ag.genre_id = g.genre_id
            WHERE ag.artist_id = $1 AND ag.genre_id = $2
            LIMIT 1
        `, [artist_id, genre_id]);

        res.status(201).json(names.rows[0]);
    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                error: "Selected artist or genre does not exist."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/artist_genre/:artist_id/:genre_id", async (req, res) => {
    try {
        const { artist_id, genre_id } = req.params;

        const result = await pool.query(`
            DELETE FROM artist_genre
            WHERE artist_id = $1 AND genre_id = $2
            RETURNING artist_id, genre_id
        `, [artist_id, genre_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Artist genre not found" });
        }
        res.json({
            message: "Artist genre deleted successfully",
            artist_id,
            genre_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


/* =========================================================
   ARTIST MEMBER: DELETE  (GET, POST, PUT already exist)
========================================================= */

app.delete("/api/artist_member/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            DELETE FROM artist_member
            WHERE member_id = $1
            RETURNING member_id
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Artist member not found" });
        }
        res.json({
            message: "Artist member deleted successfully",
            member_id: req.params.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


/* =========================================================
   SONG: PUT  (GET, POST, DELETE already exist)
========================================================= */

app.put("/api/song", async (req, res) => {
    try {
        const { old_song_id, song_id, song_name, artist_id } = req.body;

        const result = await pool.query(`
            UPDATE song
            SET
                song_id = $1,
                song_name = $2,
                artist_id = $3
            WHERE song_id = $4
            RETURNING song_id, song_name, artist_id
        `, [song_id, song_name, artist_id, old_song_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Song not found" });
        }

        const song = result.rows[0];

        const artistResult = await pool.query(`
            SELECT artist_name
            FROM artists
            WHERE artist_id = $1
        `, [song.artist_id]);

        song.artist_name = artistResult.rows[0]?.artist_name || null;

        res.json(song);
    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({ error: "Song ID already exists." });
        }
        if (error.code === "23503") {
            return res.status(400).json({
                error: "Selected artist does not exist, or this song is used in a setlist."
            });
        }
        res.status(500).json({ error: error.message });
    }
});

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



/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {

    console.log(
        `Concert Management Backend running on http://localhost:${PORT}`
    );

});