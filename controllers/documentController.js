import Document from "../models/documentModel.js";


/* CREATE DOCUMENT */

export const createDocument = async (req, res) => {

  try {

    const document = await Document.create(req.body);

    res.status(201).json({
      success: true,
      message: "Document uploaded",
      document
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* GET TENANT DOCUMENTS */

export const getTenantDocuments = async (req, res) => {

  try {

    const { tenantId } = req.params;

    const documents = await Document.find({
      tenantId
    });

    res.json({
      success: true,
      documents
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* VERIFY DOCUMENT */

export const verifyDocument = async (req, res) => {

  try {

    const document = await Document.findByIdAndUpdate(
      req.params.docId,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Document status updated",
      document
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};