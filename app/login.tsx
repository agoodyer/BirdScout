import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../store/firebaseConfig";
import { useRouter } from "expo-router";

export default function Login({ setIsLoggedIn }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flexDirection: "row", alignItems: "center"}}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 120, opacity: 0.8}}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSignUp} onPress={() => router.navigate("/register")}>
          <Text style={styles.buttonTextSignUp}>Sign Up</Text>
      </TouchableOpacity> 
      </View>     
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00BDFF",
    marginBottom: 10,
  },
  subtitle:{
    fontSize: 20,
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#00BDFF',
    backgroundColor: 'white',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  button: {
    width: "47%",
    padding: 12,
    backgroundColor: "#00BDFF",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor:'#00BDFF',
    marginVertical: 10,
    marginHorizontal:10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonSignUp: {
    width: "47%",
    padding: 12,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
    borderColor: '#00BDFF',
    borderWidth: 2,
    marginVertical: 10,
    marginHorizontal:10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextSignUp: {
    color: '#00BDFF',
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    color: "#00BDFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
});
