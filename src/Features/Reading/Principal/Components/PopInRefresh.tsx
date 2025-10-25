import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// Style
import { ButtonStyles } from '../../../../styles/Button';
import { TextStyles } from '../../../../styles/Text';
//components
import LabelBubble from '../../../../Components/LabelsBuble';


interface RefreshPopInProps {
  labelActivate: number[];
  onRefresh: () => void;
  visible: boolean;
  onClose: () => void;
}

export default function RefreshPopIn({ labelActivate, onRefresh, visible, onClose }: RefreshPopInProps) {
  const [reLoadLabels, setReloadLabels] = useState(false);
  useEffect(()=> {
    setReloadLabels(set=> !set);
  }, [labelActivate]);

  if (!visible) return null;
  return (
    <Pressable
        onPress={()=> {onRefresh(); onClose();}}
        style={ButtonStyles.Refresh}
    >
        <View style={{minWidth:30}}>
            <LabelBubble SizeRound={18} labelsId={labelActivate} reLoadLabels={reLoadLabels}/>
        </View>
        <Text style={TextStyles.TextPost}>Refresh</Text>
    </Pressable>
  );
}
