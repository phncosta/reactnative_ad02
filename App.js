import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image, Modal } from 'react-native';
import Constants from 'expo-constants';

async function executeGet(url, jsonState) {

  await fetch(url)
    .then(response => {
      if (response.status === 200) {
        response.json().then(function (result) {
          jsonState(result)
        });
      } else
        throw new Error('Erro ao consumir a API.');
    })
    .then(response => {
      // console.debug(response);
    }).catch(error => {
      console.error(error);
    });
}

const ShowDetails = ({ display, toogleModal, mensagem }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={display}
    onRequestClose={toogleModal}
  >

    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Pressable onPress={toogleModal}>
          <Text>{mensagem}</Text>
        </Pressable>
      </View>
    </View>

  </Modal>

)

const Person = ({ nome, email, link }) => {

  const [modal, setModal] = React.useState(false)

  function mudaModal() {
    setModal(!modal)
  }

  return (
    <View>
      <ShowDetails display={modal} toogleModal={mudaModal} mensagem={email} />

      <Pressable onPress={mudaModal}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: link,
          }}
        />

        <Text style={styles.paragraph}>{nome}</Text>
      </Pressable>
    </View>
  )
}

export default function App() {

  const [jsonData, setJsonData] = React.useState({})

  executeGet("https://reqres.in/api/users?page=2", setJsonData)

  function myItem({ item }) {
    return (
      <Person nome={`${item.first_name} ${item.last_name}`}
        link={item.avatar}
        email={item.email}
      />
    )
  }


  return (

    <View style={styles.container}>

      <FlatList
        data={jsonData.data}
        renderItem={myItem}
        ListHeaderComponent={() => <Text style={styles.myHeader}>Cabeçalho</Text>}
        keyExtractor={item => item.id}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'cyan'
  },
  tinyLogo: {
    width: 50,
    height: 50,
    shadowRadius: 4,
    borderRadius: 50,
    alignSelf: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  myHeader: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'orange'
  }
});
