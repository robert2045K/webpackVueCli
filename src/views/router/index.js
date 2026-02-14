import {createRouter, createWebHistory} from "vue-router";
const Home = () => import(/* webpackChunkName: "Home" */ "../Home");
const About = () => import(/* webpackChunkName: "About" */ "../About");
export default createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/Home',
            name: 'Home',
            component: Home
        },
        {
            path: '/About',
            name: 'About',
            component: About
        }
   ]
})