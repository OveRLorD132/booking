import { Router } from "express";

import authCheck from "../module/middlewares/auth-check.js";

import UserPhotos from "../module/serve-static/user-photos.js";

let userPhotos = new UserPhotos();

import validation from "../module/user-properties-change/validation.js";

import Users from "../module/db/postgres/Users.js";

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

let users = new Users();

let router = Router();

router.get("/profile", authCheck.authCheckBrowser, async (req, res) => {
  res.render("Profile");
});

router.post(
  "/profile/image-upload",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      userPhotos.loadPhoto(req.body.img, req.user.id);
      res.status(200);
      res.send("Success");
    } catch (err) {
      console.error(err);
      res.status(400);
      req.flash("error", "Internal Server Error");
      res.send("Error");
    }
  }
);

router.delete(
  "/profile/image-delete",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      await userPhotos.deletePhoto(req.user.id);
    } catch (err) {
      if (err.code === "ENOENT") {
        res.status(204);
        res.send("No File");
      } else {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal Server Error");
        res.send("Error");
      }
    }
  }
);

router.patch(
  "/profile/change-property/username",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateUsername(req.body.value);
      try {
        if (await users.checkUsernameUnique(req.body.value)) {
          res.status(500);
          req.flash("error", `This username is already taken`);
          res.send("Not unique");
        } else {
          try {
            await users.changeUserProperty(
              "username",
              req.body.value,
              req.user.id
            );
            res.status(200);
            req.flash("success", "Property changed successfully");
            res.send("Success");
          } catch (err) {
            console.error(err);
            res.status(400);
            req.flash("error", "Internal server error");
          }
        }
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/email",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateEmail(req.body.value);
      try {
        if (await users.checkEmailUnique(req.body.value)) {
          res.status(500);
          req.flash("error", `This e-mail is already taken`);
          res.send("Not unique");
        } else {
          try {
            await users.changeUserProperty(
              "email",
              req.body.value,
              req.user.id
            );
            res.status(200);
            req.flash("success", "Property changed successfully");
            res.send("Success");
          } catch (err) {
            console.error(err);
            res.status(400);
            req.flash("error", "Internal server error");
          }
        }
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/first-name",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateFirstName(req.body.value);
      try {
        await users.changeUserProperty(
          "first_name",
          req.body.value,
          req.user.id
        );
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/last-name",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateLastName(req.body.value);
      try {
        await users.changeUserProperty(
          "last_name",
          req.body.value,
          req.user.id
        );
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/birth-date",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateBirthDate(req.body.value);
      try {
        await users.changeUserProperty(
          "birth-date",
          req.body.value,
          req.user.id
        );
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/gender",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateGender(req.body.value);
      try {
        await users.changeUserProperty("gender", req.body.value, req.user.id);
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/phone-num",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validatePhoneNumber(req.body.value);
      try {
        await users.changeUserProperty(
          "phone_number",
          req.body.value,
          req.user.id
        );
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch(
  "/profile/change-property/country",
  authCheck.authCheckClient,
  async (req, res) => {
    try {
      validation.validateCountry(req.body.value);
      try {
        await users.changeUserProperty("country", req.body.value, req.user.id);
        res.status(200);
        req.flash("success", "Property changed successfully");
        res.send("Success");
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

router.patch("/profile/change-settings", authCheck.authCheckClient, async (req, res) => {
    let { type, description } = req.body;
    try {
      validation.validateType(type);
      validation.validateDescription(description, type);
      try {
        if (req.user.description !== description)
          await users.changeUserProperty(
            "description",
            description,
            req.user.id
          );
        if (req.user.type !== type)
          await users.changeUserProperty("type", type, req.user.id);
        if(type == 'Guest') await rent.hideUserRent(req.user.id);
        res.status(200);
        req.flash('success', 'Profile settings changed successfully');
        res.send('Success');
      } catch (err) {
        console.error(err);
        res.status(400);
        req.flash("error", "Internal server error");
      }
    } catch (err) {
      res.status(500);
      req.flash("error", err.message);
      res.send("Validation error");
    }
  }
);

export default router;
