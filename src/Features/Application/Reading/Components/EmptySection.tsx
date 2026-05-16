import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TextStyles } from "../../../../styles/Text";
import { Colors } from "../../../../styles/theme";
import { ColorsLabels } from "../../../../styles/ColorsLabels";

export default function EmptySection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <View style={{width:'100%', height:300, alignItems:'center', justifyContent:'flex-end'}}>
            {/* Example of Posts */}
            <View style={{width:'80%', height:180, borderRadius:20, backgroundColor:Colors.Background_Primary, position:'absolute', top:10, borderWidth:2, borderColor:Colors.Background_Elements, padding:15, paddingVertical:20}}/>
            <View style={{width:'85%', height:180, borderRadius:20, backgroundColor:Colors.Background_Primary, position:'absolute', top:30, borderWidth:2, borderColor:Colors.Background_Elements, padding:15, paddingVertical:20}}/>
            <View style={{width:'90%', height:180, borderRadius:20, backgroundColor:Colors.Background_Primary, position:'absolute', top:50, borderWidth:2, borderColor:Colors.Background_Elements, padding:20, paddingVertical:25}}>
                <View style={{flexDirection:'row', alignItems:'center', gap:-10, marginBottom:15}}>
                    <View style={{width:20, height:20, borderRadius:10, backgroundColor:ColorsLabels[5], marginRight:-8, borderWidth:2, borderColor:Colors.Background_Primary}}/>
                    <View style={{width:20, height:20, borderRadius:10, backgroundColor:ColorsLabels[22], borderWidth:2, borderColor:Colors.Background_Primary}}/>
                </View>
                <View style={{marginTop:10, width:'100%', height:10, backgroundColor:Colors.Background_Elements, borderRadius:5}}/>
                <View style={{marginTop:10, width:'80%', height:10, backgroundColor:Colors.Background_Elements, borderRadius:5}}/>
                <View style={{marginTop:10, width:'90%', height:10, backgroundColor:Colors.Background_Elements, borderRadius:5}}/>
            </View>
            
            {/* Text */}
            <Text style={[TextStyles.TextPost, {textAlign:'center', marginTop:20, fontSize:20}]}>Your feed begins here.</Text>
        </View>
    );
}