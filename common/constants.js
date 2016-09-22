exports.operationResults = {
    success: {
        code: 0
    },
    invalidRequest: {
        code: 'ER_1',
        message: 'Invalid request sent'
    },
    internalError: {
        code: 'ER_2',
        message: 'Internal error occurred'
    },
    problemConnectingToDb: {
        code: 'ER_3',
        message: 'Problem connecting to DB'
    },
    dbOperationFailed: {
        code: 'ER_4',
        message: 'DB Operation failed'
    },
    albumOps: {
        addAlbumNameExists: {
            code: 'ER_5',
            message: 'Album name already exists'
        },
        addAlbumNameInUrlExists: {
            code: 'ER_6',
            message: 'Name in url already exists'
        }
    }
};