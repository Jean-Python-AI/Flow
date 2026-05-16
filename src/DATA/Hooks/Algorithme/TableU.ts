import { useState } from "react";
// Import du DB
import { insertOrUpdateTableULink_ClickedAfter } from "../../DataBase/TableURepository";


// Enregistre les postes clické
let clikedPosts: number[] = [];


export function useTableU() {

    const ClickPost = async (postId: number) => {
        console.log('Click Post ID:', postId);
        const first = clikedPosts[0]? postId!==clikedPosts[0]? clikedPosts[0] :-1 :-1;
        const second = clikedPosts[1]? postId!==clikedPosts[1]? clikedPosts[1] :-1 :-1;
        const third = clikedPosts[2]? postId!==clikedPosts[2]? clikedPosts[2] :-1 :-1;
        const fourth = clikedPosts[3]? postId!==clikedPosts[3]? clikedPosts[3] :-1 :-1;
        const fifth = clikedPosts[4]? postId!==clikedPosts[4]? clikedPosts[4] :-1 :-1;

        // Calcul
        if (first !== -1) await insertOrUpdateTableULink_ClickedAfter(first, postId, 1.2);
        if (second !== -1) await insertOrUpdateTableULink_ClickedAfter(second, postId, 1.15);
        if (third !== -1) await insertOrUpdateTableULink_ClickedAfter(third, postId, 1.1);
        if (fourth !== -1) await insertOrUpdateTableULink_ClickedAfter(fourth, postId, 1.05);
        if (fifth !== -1) await insertOrUpdateTableULink_ClickedAfter(fifth, postId, 1.01);

        // Mise à jour de la liste
        clikedPosts = [postId, ...clikedPosts.filter(id => id !== postId)].slice(0,5);
        console.log('Clicked Posts:', clikedPosts);
    };

    const ViewPostMore_5sec = async (postId: number) => {
        // À implémenter plus tard
    }

    return {
        ClickPost,
        ViewPostMore_5sec
    };
};