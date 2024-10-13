import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import axios from "axios";
import { db } from "@/db/drizzle";
import { companyTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OutputAddress } from "@/zustand/address";

const address_model_url = process.env.PYTHON_SERVER_URL;

const app = new Hono()
  .post(
    "/bulk-address",
    zValidator(
      "json",
      z.object({
        addresses: z.string().array().min(1),
      })
    ),
    zValidator(
      "param",
      z.object({
        email: z.string().email(),
      })
    ),
    async (c) => {
      const addresses = c.req.valid("json").addresses;
      const email = c.req.valid("param").email;

      let corrected_addresses: OutputAddress[] = [];

      const [user] = await db
        .select()
        .from(companyTable)
        .where(eq(companyTable.email, email));

      if (!user) {
        return c.json({ error: "Unauthorized User" }, 404);
      }

      try {
        const res = await axios.post(
          `${address_model_url}/bulk_process_addresses`,
          { addresses }
        );
        corrected_addresses = res.data.data;

        // Apply pincode replacement logic for corrected_address
        corrected_addresses = corrected_addresses.map((entry) => {
          if (entry.predicted_pincode) {
            const correctedWithoutPincode = entry.corrected_address.replace(/\d{6}$/, '');
            entry.corrected_address = `${correctedWithoutPincode.trim()} ${entry.predicted_pincode}`;
          }
          return entry;
        });
        
      } catch (err) {
        console.log("BULK_ADDRESS[POST]:", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }

      return c.json(
        {
          corrected_addresses,
        },
        200
      );
    }
  )
  .post(
    "/single-address",
    zValidator(
      "json",
      z.object({
        address: z.string().min(1),
      })
    ),
    zValidator(
      "param",
      z.object({
        email: z.string().email(),
      })
    ),
    async (c) => {
      const address = c.req.valid("json").address;
      const email = c.req.valid("param").email;

      let corrected_address: OutputAddress | null = null;

      const [user] = await db
        .select()
        .from(companyTable)
        .where(eq(companyTable.email, email));

      if (!user) {
        return c.json({ error: "Unauthorized User" }, 404);
      }

      try {
        const res = await axios.post(`${address_model_url}/process_address`, {
          address,
        });
        corrected_address = res.data.data;

        // Apply pincode replacement logic for single corrected_address
        if (corrected_address?.predicted_pincode) {
          const correctedWithoutPincode = corrected_address.corrected_address.replace(/\d{6}$/, '');
          corrected_address.corrected_address = `${correctedWithoutPincode.trim()} ${corrected_address.predicted_pincode}`;
        }

      } catch (err) {
        console.log("BULK_ADDRESS[POST]:", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }

      if (corrected_address == null) {
        return c.json({ error: "Internal Server Error" }, 500);
      }

      return c.json(
        {
          corrected_address,
        },
        200
      );
    }
  );

export default app;
