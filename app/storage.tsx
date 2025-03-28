import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function Storage() {

    const router = useRouter();

    return (

        <>
            <ThemedView style={styles.titleContainer}>
                <TouchableOpacity onPress={() => router.back()} >
                    <Octicons name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <ThemedText type="subtitle">Storage Settings</ThemedText>
            </ThemedView>
        </>
    ); 
    
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: '20%',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingBottom:15

    },
 
});
