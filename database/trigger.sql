CREATE OR REPLACE FUNCTION update_ticket_type_available()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    -- INSERT
    IF TG_OP = 'INSERT' THEN

        IF NEW.ticket_status IN ('Active', 'Used') THEN

            UPDATE ticket_type
            SET available = available - 1
            WHERE ticket_type_id = NEW.ticket_type_id
              AND available > 0;

            IF NOT FOUND THEN
                RAISE EXCEPTION
                    'No available tickets remaining for ticket type %',
                    NEW.ticket_type_id;
            END IF;

        END IF;

        RETURN NEW;
    END IF;


    -- UPDATE
    IF TG_OP = 'UPDATE' THEN

        IF OLD.ticket_type_id = NEW.ticket_type_id THEN

            -- Active/Used -> Cancelled
            IF OLD.ticket_status IN ('Active', 'Used')
               AND NEW.ticket_status = 'Cancelled' THEN

                UPDATE ticket_type
                SET available = available + 1
                WHERE ticket_type_id = NEW.ticket_type_id;

            END IF;


            -- Cancelled -> Active/Used
            IF OLD.ticket_status = 'Cancelled'
               AND NEW.ticket_status IN ('Active', 'Used') THEN

                UPDATE ticket_type
                SET available = available - 1
                WHERE ticket_type_id = NEW.ticket_type_id
                  AND available > 0;

                IF NOT FOUND THEN
                    RAISE EXCEPTION
                        'No available tickets remaining for ticket type %',
                        NEW.ticket_type_id;
                END IF;

            END IF;

        ELSE

            -- Ticket type changed

            IF OLD.ticket_status IN ('Active', 'Used') THEN

                UPDATE ticket_type
                SET available = available + 1
                WHERE ticket_type_id = OLD.ticket_type_id;

            END IF;


            IF NEW.ticket_status IN ('Active', 'Used') THEN

                UPDATE ticket_type
                SET available = available - 1
                WHERE ticket_type_id = NEW.ticket_type_id
                  AND available > 0;

                IF NOT FOUND THEN
                    RAISE EXCEPTION
                        'No available tickets remaining for ticket type %',
                        NEW.ticket_type_id;
                END IF;

            END IF;

        END IF;

        RETURN NEW;
    END IF;


    -- DELETE
    IF TG_OP = 'DELETE' THEN

        IF OLD.ticket_status IN ('Active', 'Used') THEN

            UPDATE ticket_type
            SET available = available + 1
            WHERE ticket_type_id = OLD.ticket_type_id;

        END IF;

        RETURN OLD;
    END IF;


    RETURN NULL;

END;
$$;