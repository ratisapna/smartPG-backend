import Document from "../models/documentModel.js";
import { getUploadPresignedUrl, getDownloadPresignedUrl } from "../utils/s3Config.js";
import Tenant from "../models/tenantModel.js";
import PG from "../models/pgModel.js";


/* CREATE DOCUMENT */

export const createDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tenant = await Tenant.findOne({ userId });
    if (!tenant) return res.status(404).json({ success: false, message: "Tenant record not found" });

    const { type, fileName, fileType } = req.body;
    const s3Key = `documents/${tenant._id}/${Date.now()}-${fileName}`;

    const uploadUrl = await getUploadPresignedUrl(s3Key, fileType);

    const document = await Document.create({
      tenantId: tenant._id,
      type,
      s3Key,
      verificationStatus: "UPLOADED"
    });

    res.status(201).json({
      success: true,
      message: "Document record created. Use the uploadUrl to upload the file.",
      document,
      uploadUrl
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
    const userId = req.user.userId;
    const role = req.user.role;

    const targetTenant = await Tenant.findById(tenantId);
    if (!targetTenant) return res.status(404).json({ success: false, message: "Tenant not found" });

    // Security: Only the tenant themselves or the owner of their PG can view documents
    if (role === "TENANT" && String(targetTenant.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized: You can only view your own documents" });
    }

    if (role === "OWNER") {
      const pg = await PG.findOne({ _id: targetTenant.pgId, ownerId: userId });
      if (!pg) return res.status(403).json({ success: false, message: "Unauthorized: You do not own the PG this tenant belongs to" });
    }

    const documents = await Document.find({ tenantId }).lean();

    const docsWithUrls = await Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        url: await getDownloadPresignedUrl(doc.s3Key)
      }))
    );

    res.json({
      success: true,
      documents: docsWithUrls
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