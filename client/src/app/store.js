import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer.js"
import { authApi } from "@/features/api/authApi.js"
import { userLoggedIn } from "@/features/authSlice.js"
import { courseApi } from "@/features/api/courseApi.js"

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware)
})

const initializeApp = async() => {
    const result = await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))

    if(result?.data) {
        appStore.dispatch(userLoggedIn({user:result.data}))
    }
}
initializeApp();