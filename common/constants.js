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
        id: {
            code: 'ER_7',
            message: 'Album id already exists. Contact dev team.'
        },
        addAlbumNameExists: {
            code: 'ER_5',
            message: 'Album name already exists'
        },
        trackIdBeingAddedNotFound: {
            code: 'ER_6',
            message: 'Track Id you are trying to add does not exist in Database. Contact dev team.'
        },
        albumBeingEditedDoesNotExist: {
            code: 'ER_8',
            message: 'Album you are trying to edit does not exist in Database. Contact dev team.'
        },
        idEmpty: {
            code: 'ER_11',
            message: 'Album id is empty. Contact dev team.'
        },
        nameEmpty: {
            code: 'ER_12',
            message: 'Album name is empty. Contact dev team.'
        },
        addAlbumIdAlreadyExists: {
            code: 'ER_15',
            message: 'Album Id being added already exists. Contact dev team.'
        }

    },
    trackOps: {
        idEmpty: {
            code: 'ER_9',
            message: 'Track id is empty. Contact dev team.'
        },
        nameEmpty: {
            code: 'ER_10',
            message: 'Track name is empty. Contact dev team.'
        },
        albumNotPresentInDb: {
            code: 'ER_13',
            message: 'The album you have associated with track does not exist. Contact dev team'
        },
        trackBeingEditedDoesNotExist: {
            code: 'ER_14',
            message: 'Album you are trying to edit does not exist in Database. Contact dev team'
        },
        addTrackNameAlreadyExists: {
            code: 'ER_16',
            message: 'Track name already exists'
        },
        addTrackIdAlreadyExists: {
            code: 'ER_15',
            message: 'Track Id being added already exists. Contact dev team.'
        }

    }
};