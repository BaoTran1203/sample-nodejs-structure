export const CONFIG: any = {
    METHOD: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE'
    },
    PAGE: 1,
    PPP: 20,
    DEFAULT_THUMBNAIL: 'http://www.indigohealth.com.au/wp-content/themes/rheniumific/images/thumbnail.png',
    JWT: {
        SECRET_KEY: 'MyPrivateKey',
        OPTIONS: { expiresIn: '30 days' }
    },
    MONGO: {
        SCHEMA: {
            versionKey: false,
            strict: true,
            id: false,
            toObject: { virtuals: true },
            toJSON: { virtuals: true },
        },
        OPTIONS: {
            runValidators: true,
            new: true
        }
    }
};