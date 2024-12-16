import type { FunctionUris } from '../types/functionUris';

export function getFunctionUris(baseUri: string) : FunctionUris {
    if(baseUri.includes('localhost') || baseUri.includes('127.0.0.1')) {
        return {
            setIsAdmin: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/setIsAdmin',
            setIsPrivilegedUser: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/setIsPrivilegedUser',
            getUsers: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/getUsers',
            cancelReservation: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/cancelReservation',
            makeReservation: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/makeReservation',
            updateUserProfile: 'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/updateUser',
        }
    }
    return {
        setIsAdmin: 'https://setisadmin-joqt3ovt4q-ew.a.run.app',
        setIsPrivilegedUser: 'https://setisprivilegeduser-joqt3ovt4q-ew.a.run.app',
        getUsers: 'https://getusers-joqt3ovt4q-ew.a.run.app',
        cancelReservation: 'https://cancelreservation-joqt3ovt4q-ew.a.run.app',
        makeReservation: 'https://makereservation-joqt3ovt4q-ew.a.run.app',
        updateUserProfile: 'https://updateuser-joqt3ovt4q-ew.a.run.app',
    }
}
