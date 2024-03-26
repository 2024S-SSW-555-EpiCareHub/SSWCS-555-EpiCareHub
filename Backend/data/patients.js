import { patients } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  checkIsProperString,
  isDateValid,
  validateId,
  checkIsProperNumber,
  calulateAge,
  mapGender,
  validateEmail,
} from "./helper.js";
import moment from "moment";

const exportedMethods = {
  async addPaitent(firstName, lastName, dob, gender, email) {
    firstName = checkIsProperString(firstName, "firstName");
    lastName = checkIsProperString(lastName, "lastName");
    dob = checkIsProperString(dob, "date of birth");
    dob = isDateValid(dob, "date of birth");
    email = validateEmail(email, "email");
    checkIsProperNumber(gender, "gender");


    const patientsCollection = await patients();

    const existingPatient = await patientsCollection.findOne({
      email: email,
    });

    if (existingPatient) {
      throw new Error("A patient with the same email address already exists.");
    }

    let newPaitent = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      gender: mapGender[gender],
      email: email,
      isEpilepsy: false,
      creationDate: moment().format(),
    };



    const newInsertInformation = await patientsCollection.insertOne(newPaitent);

    if (!newInsertInformation.insertedId) throw new Error("Insert failed!");
    return await this.getPaitentById(
      newInsertInformation.insertedId.toString()
    );
  },

  async getPaitentById(id) {
    id = validateId(id, "id");
    const patientsCollection = await patients();
    const patient = await patientsCollection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    if (!patient) throw new Error("Error: Paitent not found");
    patient.age = calulateAge(patient.dob);
    return patient;
  },

  async getAllPaitents(filterObject) {
    if (filterObject.firstName !== undefined)
      filterObject.firstName = checkIsProperString(
        filterObject.firstName,
        "firstName"
      );
    if (filterObject.lastName !== undefined)
      filterObject.lastName = checkIsProperString(
        filterObject.lastName,
        "lastName"
      );
    if (filterObject.dob !== undefined) {
      filterObject.dob = checkIsProperString(filterObject.dob, "date of birth");
      filterObject.dob = isDateValid(filterObject.dob, "date of birth");
    }

    if (filterObject.email !== undefined)
      filterObject.email = validateEmail(filterObject.email, "email");


    const patientsCollection = await patients();

    let filter = {};

    if (
      filterObject.firstName ||
      filterObject.lastName ||
      filterObject.dob ||
      filterObject.email
    ) {
      if (filterObject.firstName) filter.firstName = filterObject.firstName;
      if (filterObject.lastName) filter.lastName = filterObject.lastName;
      if (filterObject.dob) filter.dob = filterObject.dob;
      if (filterObject.email) filter.email = filterObject.email;
    }

    // Retrieve patients based on the constructed filter
    let patientsList = await patientsCollection.find(filter).toArray();

    patientsList = patientsList.map((object) => {
      object.age = calulateAge(object.dob);
      return object;
    });

    return patientsList;
  },

  async removePatient(id) {
    id = validateId(id, "paitent id");

    const patientsCollection = await patients();

    const deletionInfo = await patientsCollection.findOneAndDelete({
      _id: ObjectId.createFromHexString(id),
    });

    if (!deletionInfo) {
      throw new Error(`Could not delete patient with id of ${id}`);
    }

    const { _id } = deletionInfo;
    return { _id: _id, deleted: true };
  },

  async updatePatientInfo(id, updateObject) {
    id = validateId(id, "patient id");
    updateObject.firstName = checkIsProperString(
      filterObject.firstName,
      "firstName"
    );
    updateObject.lastName = checkIsProperString(
      filterObject.lastName,
      "lastName"
    );
    updateObject.dob = checkIsProperString(filterObject.dob, "date of birth");
    updateObject.dob = isDateValid(filterObject.dob, "date of birth");
    updateObject.gender = checkIsProperNumber(filterObject.gender, "gender");
    updateObject.email = validateEmail(filterObject.email);

    const patientsCollection = await patients();

    const updatePatient = await patientsCollection.findOneAndUpdate(
      {
        _id: ObjectId.createFromHexString(id),
      },
      {
        $set: updateObject,
      },
      {
        returnDocument: "after",
      }
    );

    if (!updatePatient) throw new Error("could not update");

    updatePatient.age = calulateAge(updatePatient.dob);

    return updatePatient;
  },
};

export default exportedMethods;
