

import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCqT2_esuNLrVZP1z9gnAFp1gS0loPcZ6g",
    authDomain: "bill-709ba.firebaseapp.com",
    projectId: "bill-709ba",
    storageBucket: "bill-709ba.appspot.com",
    messagingSenderId: "957700882002",
    appId: "1:957700882002:web:b543c0c058b76f569fe98b",
    measurementId: "G-J6BLF8R0VL"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
        this.selectedPost = {};
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    async register(name, email, password) {
        console.log("registered")
        await this.auth.createUserWithEmailAndPassword(email, password);
        return this.auth.currentUser.updateProfile({
            displayName: name
        });
    }

    addUser(userobj) {
        if (!this.auth.currentUser) {
            return alert("Not authorized");
        }
        console.log(userobj, "adduser");
        return this.db.doc(`/users/${this.auth.currentUser.uid}`).set({
            [this.auth.currentUser.uid]: userobj
        });
    }
    addDebitBill(billObj,shopId) {
        console.log(billObj)
        return this.db.doc(`/shop/${shopId}`).set({
            [shopId]: billObj
        });
    }
    getUserDetails(cb) {
        return this.db
            .collection("users")
            .doc(`${this.auth.currentUser.uid}`)
            .get()
            .then((s) => {
                if (s.exists) {
                    cb(s.data());
                }
            });
    }
    getAreaDetails(cb) {
        this.db
            .collection("area")
            .doc('5bMAc7668xI9AzjaPHP0')
            .get()
            .then((s) => {
                if (s.exists) {
                    console.log(s.data());
                    cb(s.data())
                }
            });
    }
    getShopDetails(cb,areaId) {
        console.log(areaId, typeof areaId)
        this.db
            .collection("area")
            .doc(`${areaId.toString()}`)
            .get()
            .then((s) => {
                console.log(s)
                if (s.exists) {
                    console.log(s.data());
                    cb(s.data())
                }
            });
    }
    getAllShops(cb) {
              this.db
            .collection("shop")            
            .get()
            .then((s) => {
                console.log("inside",s)
                if (s.docs.length) {
                    console.log("shops",s.docs.map(doc => doc.data()));
                    cb(s.docs.map(doc => doc.data()))
                }
            });
    }
    getCorrespondingShopDetails(cb, shopId){
        this.db
        .collection("shop")
        .doc(`${shopId.toString()}`)
        .get()
        .then((s) => {
            console.log(s)
            if (s.exists) {
                console.log(s.data());
                cb(s.data())
            }
        });
    }
    isInitialized() {
        return new Promise((resolve) => {
            this.auth.onAuthStateChanged(resolve);
        });
    }
    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName;
    }
    // uploadImgFile(file, cb) {
    //   let id = uuidv4();
    //   console.log(storage.storage());
    //   const upload = storage
    //     .storage()
    //     .ref(`/images/${this.auth.currentUser.uid + id}`)
    //     .put(file);
    //   upload.on("state_changed", console.log, console.error, () => {
    //     storage
    //       .storage()
    //       .ref("images")
    //       .child(this.auth.currentUser.uid + id)
    //       .getDownloadURL()
    //       .then((url) => {
    //         console.log(url);
    //         cb(url);
    //       });
    //   });
    // }
}
export default new Firebase();