import React, {Component} from 'react';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import LastPhotoTaken from "./LastPhotoTaken";

const CamerToolBar = props => {
    return (
        <View style={toolbarStyle.bottomToolbar}>        
			<View style={toolbarStyle.alignCenter}>
                 <LastPhotoTaken lastCapture={props.lastCapture}/>
			</View>
			<View style={toolbarStyle.alignCenter}>
				<TouchableWithoutFeedback
					onPress={props.onShortCapture}>
					<View style={toolbarStyle.captureBtn}/>
				</TouchableWithoutFeedback>
			</View>
			<View style={toolbarStyle.alignCenter}>
				{props.lastCapture &&
				<TouchableOpacity
					onPress={props.onCheckPress}>
					<MaterialCommunityIcons
						name="check"
						color="black"
						size={40}
					/>
				</TouchableOpacity>
				}
			</View>
		</View>
    );
};

export default CamerToolBar;

const toolbarStyle = StyleSheet.create({
    bottomToolbar: {
        width: Dimensions.get('screen').width,
        position: 'absolute',
        height: 100,
        bottom: 0,
        backgroundColor: '#FFFFFF',
		flex: 1, 
		flexDirection: 'row'
    },
    alignCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureBtn: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderRadius: 60,
        borderColor: "#000000",
    },
});