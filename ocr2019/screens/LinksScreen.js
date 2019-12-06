import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import CamearToolBar from "../components/CamearToolBar";
import network from "../api/network";
import * as ImageManipulator from 'expo-image-manipulator';
import { ToastAndroid } from 'react-native';
import * as firebase from 'firebase';

const firebaseConfig = {
  // apiKey: "AIzaSyCats6hwFz9pnobG8wTFbQ6W-5B9KocLRM",
  apiKey: "AIzaSyDNJv_AgDG2EpO9s31lthAxs5XCWaMntGU",
  authDomain: "focus-tree-255002.firebaseapp.com",
  databaseURL: "",
  storageBucket: "focus-tree-255002.appspot.com",
};
firebase.initializeApp(firebaseConfig);

export default class CameraScreen extends React.Component {
    state = {
        hasCameraPermission: null,
        lastCapture: null,
        imgUri: '',
    };

    //Take photo action
    takePicture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({lastCapture: photoData, imgUri: photoData.uri});
    };

    //Used when the user confirms the photo.
    pressCheck = async() => {
        //console.log('imguri:');
        //console.log(this.state.imgUri);
		const imgManResp = await ImageManipulator.manipulateAsync(this.state.imgUri, [], { base64: false, compress: 0.1, format: ImageManipulator.SaveFormat.JPEG });

		// Start to handle firebase img uploading.
		const response = await fetch(imgManResp.uri);
		const blob = await response.blob();
		var ref = await firebase.storage().ref().child('images/detection.jpg');
		ref.put(blob).then(async () => {
			console.log("in blob.");
			const downloadUrl = await ref.getDownloadURL().then(function (downloadURL) {
			  console.log('File available at2', downloadURL);
			  return downloadURL;
			});
			await this.setState({imgUri: downloadUrl});
			//Here is the http request
			const report = {
			  r_img_url: this.state.imgUri
			};//!!! should not use post(url, {xx:xx}}; it will
			//have weird bugs
			try {
				console.log("start posting");
				const response = await network.post('/imageMobile', report);
				console.log("reports : " + response.data.message);
				var test = "pikachuuu"
				ToastAndroid.show(response.data.message, ToastAndroid.LONG);
			} catch (errorResponse) {
			    console.log('errorResponse  ', errorResponse);
				ToastAndroid.show(errorResponse, ToastAndroid.LONG);
			}
		  }
		).catch((error) => {
			ToastAndroid.show(error, ToastAndroid.LONG);
		  }
		);
	
    };

    //Ask for camera permission
    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    render() {
        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <React.Fragment>
                    <View>
                        <Camera
                            type={this.state.type}
                            style={cameraStyle.preview}
                            flashMode={this.state.flashMode}
                            ref={ref => {
                                this.camera = ref;
                            }}/>
                    </View>
                    <CamearToolBar
                        lastCapture={this.state.lastCapture}
                        onShortCapture={this.takePicture}
                        onCheckPress={this.pressCheck}/>
                </React.Fragment>
            );
        }
    }
}

const cameraStyle = StyleSheet.create(
    {
        preview: {
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
    }
);