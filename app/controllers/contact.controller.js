const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, resp, next) => {
  if (!req.body.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return resp.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "Some error occurred while creating the contact"),
    );
  }
};

exports.findAll = async (req, resp, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "Some error occurred while retrieving the contacts"),
    );
  }
  return resp.send(documents);
};

exports.findOne = async (req, resp, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return resp.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id}`),
    );
  }
};

exports.update = async (req, resp, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return resp.send({ message: "Contact was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id=${req.params.id}`),
    );
  }
};

exports.delete = async (req, resp, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return resp.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting contact with id=${req.params.id}`),
    );
  }
};

exports.deleteAll = async (req, resp, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return resp.send({ message: `${deletedCount} contacts were deleted successfully` });
    } catch (error) {
        return next(
            new ApiError(500, "Some error occurred while removing all contacts"),
        );
    }
};

exports.findAllFavorite = async(req, resp, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    return resp.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "Some error occurred while retrieving the favorite contacts"),
    );
  }
};
