import React from "react";
import { SafeAreaView, View, ScrollView, Text, } from "react-native";
import {Colors, } from "constants/";
export default (props) => {
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: Colors.surfaceContainerLowest,
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#FFF1C2",
					paddingTop: 68,
				}}>
				<Text 
					style={{
						color: Colors.shadow,
						fontSize: 40,
						marginBottom: 751,
						marginLeft: 166,
					}}>
					{"Home"}
				</Text>
				<View 
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginHorizontal: 43,
					}}>
					<View 
						style={{
							width: 73,
							alignItems: "center",
							backgroundColor: Colors.surfaceContainerLowest,
							paddingVertical: 17,
							marginRight: 54,
							shadowColor: "#00000040",
							shadowOpacity: 0.3,
							shadowOffset: {
							    width: 0,
							    height: 4
							},
							shadowRadius: 4,
							elevation: 4,
						}}>
						<Text 
							style={{
								color: Colors.shadow,
								fontSize: 20,
							}}>
							{"Home"}
						</Text>
					</View>
					<View 
						style={{
							width: 73,
							alignItems: "center",
							backgroundColor: Colors.surfaceContainerLowest,
							paddingVertical: 18,
							marginRight: 58,
							shadowColor: "#00000040",
							shadowOpacity: 0.3,
							shadowOffset: {
							    width: 0,
							    height: 4
							},
							shadowRadius: 4,
							elevation: 4,
						}}>
						<Text 
							style={{
								color: Colors.shadow,
								fontSize: 20,
							}}>
							{"Data"}
						</Text>
					</View>
					<View 
						style={{
							width: 73,
							alignItems: "center",
							backgroundColor: Colors.surfaceContainerLowest,
							paddingVertical: 16,
							shadowColor: "#00000040",
							shadowOpacity: 0.3,
							shadowOffset: {
							    width: 0,
							    height: 4
							},
							shadowRadius: 4,
							elevation: 4,
						}}>
						<Text 
							style={{
								color: Colors.shadow,
								fontSize: 20,
							}}>
							{"Profile"}
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}