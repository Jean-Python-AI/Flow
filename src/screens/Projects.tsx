import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Pressable, Image } from 'react-native';
// Database
import { ReadProject } from '../DataBase/Projects/Read';
// Import Styles
import { Colors } from '../styles/theme';
import { Screens } from '../styles/screens';
import { ScrollView } from 'react-native-gesture-handler';
import { TextStyles } from '../styles/Text';
// Import Components
import HeaderProjects from '../components/Headers/Projects';
import OneProject from '../components/Projects/oneProject';
import Element from '../components/Projects/elements';
import NewProjectPopIn from '../components/PopIns/NewProject';




function projectsView() {
    const [NewProjectPopIn_IsVisible, _NewProjectPopIn_IsVisible] = useState(false);

    const [projects, modifyProjects] = useState<{id: number, name: string}[]>([]);

    const reloadProjects = () => ReadProject(modifyProjects);

    useEffect(() => {
        reloadProjects();
    }, []);


    return(
        <View style={Screens.basic}>
            {/* Phone Barr style */}
            <StatusBar barStyle='dark-content' backgroundColor={Colors.Background_Primary}/>

            {/* Header -----*/}
            <HeaderProjects/>

            {/* Scroll View -----*/}
            <ScrollView style={Screens.scroll}>

                {/* Title of elements */}
                <Text style={[TextStyles.subText, TextStyles.SubTitle, TextStyles.bold]}>Projects</Text>

                {/* List of Projects */}
                {projects.map(project => (
                    <OneProject key={project.id} id={project.id} title={project.name} dots={true} onChanged={reloadProjects}/>
                ))}

                {/* Button 'New Project' */}
                <Element>
                    <Pressable
                      onPress={() => _NewProjectPopIn_IsVisible(true)}
                      style={({ pressed }) => [
                          {
                          opacity: pressed ? 0.5 : 1,
                          },
                      ]}
                      >
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10}}>
                            <Image source={require('../../assets/icons/more.png')} style={{width:20,height:20,tintColor:Colors.Text_Secondary}} />
                            <Text style={[TextStyles.Paragraph, TextStyles.semiBold, TextStyles.subText]}>New Project</Text>
                        </View>
                    </Pressable>
                </Element>

                <View style={{height:100}}></View>
            </ScrollView>

            {/* Pop In */}
            <NewProjectPopIn
              visible={NewProjectPopIn_IsVisible}
              onClose={() => _NewProjectPopIn_IsVisible(false)}
              onCreated={reloadProjects}
            />

        </View>
    );
}

export default projectsView;