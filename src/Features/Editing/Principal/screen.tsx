// IMPORTS ================================================================================
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Pressable, Image } from 'react-native';
// Database --------------------------------------------------------------
import { ReadProject } from '../../../DataBase/Projects/ReadProject';
import { WorkSpaceActivate } from '../../../DataBase/WorkSpace/WorkSpaceActivate';
// Import Styles ---------------------------------------------------------
import { Colors } from '../../../styles/theme';
import { Screens } from '../../../styles/screens';
import { ScrollView } from 'react-native-gesture-handler';
import { TextStyles } from '../../../styles/Text';
// Import Components ----------------------------------------------------
import HeaderProjects from './Components/Header';
import OneProject from './Components/Project';
import NewProjectPopIn from './Components/PopIn/NewProject_PopIn';
import { ViewsStyles } from '../../../styles/Views';
import LottieView from 'lottie-react-native';




// FUNCTION ================================================================================
function ProjectsView() {

    // WorkSpace ------------------------------------
    const [refresh, setRefresh] = useState(1);
    const [idWorkSpaceActivate, setIdWorkSpaceActivate] = useState(WorkSpaceActivate.getState().id || -1);
    useEffect(() => {
        setIdWorkSpaceActivate(WorkSpaceActivate.getState().id); // update à chaque refresh
    }, [refresh]);


    // PopIn ----------------------------------------
    const [NewProjectPopIn_IsVisible, _NewProjectPopIn_IsVisible] = useState(false);

    // For the new project creation -----------------
    const [projects, modifyProjects] = useState<{id: number, name: string }[]>([]);

    // Read the project in the dataBase -------------
    const reloadProjects = () => ReadProject(idWorkSpaceActivate, modifyProjects);

    // Function play at the start of the app --------
    const [loadingProjects, setLoadingProjects] = useState(true);
    useEffect(() => {
        reloadProjects();
        const timer = setTimeout(() => {
            setLoadingProjects(false);
        }, 3000); // 3 secondes
        return () => clearTimeout(timer); // Nettoyage
    }, [idWorkSpaceActivate, refresh]);


    // RETURN ELEMENT ----------------------------------------------------------------------
    return(
        <View style={Screens.basic}>
            {/* Phone Barr style */}
            <StatusBar barStyle='dark-content' backgroundColor={Colors.Background_Primary}/>

            {/* Header ------------------------------*/}
            <HeaderProjects modify={()=> setRefresh(set=> set+1)}/>


            {idWorkSpaceActivate === -1 ? (
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={TextStyles.TextPost}>Select Your MindSpace</Text>
                </View>
            ) : (
                <ScrollView style={Screens.scroll}>

                    {/* Title of elements ---------------*/}
                    <Text style={[TextStyles.SubTitle, {marginBottom:10}]}>Projects</Text>


                    {/* List of Projects ----------------*/}
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <OneProject key={project.id} id={project.id} title={project.name} dots={true} onChanged={reloadProjects}/>
                        ))
                    ) : (
                        loadingProjects ? (
                        <View style={{alignItems:'center', justifyContent:'flex-start', flexDirection:'row', height:100}}>
                            <LottieView
                                source={require('../../../../assets/Lotties/loader-Instagram.json')}
                                autoPlay
                                loop
                                style={{width:50, height:50}}
                            />
                            <Text style={[TextStyles.TextBlack, {textAlign:'center'}]}>Loading projects...</Text>
                        </View>
                    ) : (
                        <View style={{alignItems:'flex-start', padding:30, justifyContent:'center'}}>
                            <Text style={TextStyles.TextBlack}>Create your first project!</Text>
                        </View>
                    ))}


                    {/* Button 'New Project' ------------*/}
                    <View style={ViewsStyles.ProjectElements}>
                        <Pressable onPress={() => _NewProjectPopIn_IsVisible(true)} style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},]}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, paddingHorizontal:10}}>

                                <Image source={require('../../../../assets/icons/more.png')} style={{width:20,height:20,tintColor:Colors.ItemSecondary}} />
                                <Text style={[TextStyles.TextBlack, {color:Colors.ItemSecondary}]}>New Project</Text>

                            </View>
                        </Pressable>
                    </View>


                    <View style={{height:100}}></View>
                </ScrollView>
            )};

            {/* Pop In ---------------------------------------------------*/}
            <NewProjectPopIn visible={NewProjectPopIn_IsVisible} onClose={() => _NewProjectPopIn_IsVisible(false)} onCreated={reloadProjects}/>

        </View>
    );
}



export default ProjectsView;