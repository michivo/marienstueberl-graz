export interface UserAccount {
    uid: string,
    email: string,
    displayName: string,
    metadata: {
        creationTime: string,
        lastSignInTime: string
    },
    customClaims?: {
        admin: boolean,
        privilegedUser: boolean
    }
}