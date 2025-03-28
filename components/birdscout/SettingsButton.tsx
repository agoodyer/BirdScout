import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Octicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";





export function SettingsButton({
    text,
    route
  }: {
   text: string, 
   route: Href
  }) {

    const router = useRouter();
    return (

        <ThemedView style={{   borderTopWidth: 2,
            borderColor: '#D3D3D3',}}>

<TouchableOpacity style={styles.optionContainer} onPress={() => router.push(route)}>
        <ThemedText type="default">{text}</ThemedText>
        <Octicons name="chevron-right" size={24} color="black" />
    </TouchableOpacity>

         </ThemedView>

       

    );
  }


  const styles = StyleSheet.create({

      optionContainer: {
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'space-between',
          padding: 20,
          paddingInline: 40,
  
       
      },
  
  });