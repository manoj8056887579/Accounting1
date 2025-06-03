const express = require('express');
const {getOrganizationAdmin,putOrganizationAdmin} = require('../../controllers/dashboard/OrganizationAdminControllers');

const router = express.Router();

// Mount organization admin routes directly
router.get('/:organizationId/organizationadmin', getOrganizationAdmin);
router.put('/:organizationId/organizationadmin', putOrganizationAdmin)

module.exports = router;    