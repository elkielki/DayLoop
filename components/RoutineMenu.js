// <RoutineMenu data={routineList} routineIdx={currentRoutineIdx}
const RoutineMenu = ({data, }) => {
    const [routineMenuOpen, setRoutineMenuOpen] = useState(false);
    const [openNewRoutineForm, setOpenNewRoutineForm] = useState(false);
    
    const switchRoutines = async (idx) => {
        setCurrentRoutineIdx(idx);
        setRoutineMenuOpen(false);
        try {
          const storedCurrRoutineIdx = await AsyncStorage.setItem("currentRoutineIdx", JSON.stringify(currentRoutineIdx));
        } catch (error) {
          console.log("An error has occurred");
        }
      }
    
    return (
        <View>
            <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
                <Text style={styles.titleText}>{data[routineIdx].title}</Text> 
            </TouchableOpacity> 
            <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                    <Text>Close</Text>
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {data.map((routine, index) => (
                    <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                        <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                    </View>
                ))}
                {openNewRoutineForm && 
                    <View>
                    <TextInput
                        onChangeText={setNewRoutineInput}
                        value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                    </View>
                }
            </Modal>
            <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                    <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {routineList.map((routine, index) => (
                    <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                        <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                    </View>
                ))}
                {openNewRoutineForm && 
                    <View>
                    <TextInput
                        onChangeText={setNewRoutineInput}
                        value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                    </View>
                }
            </Modal>
        </View>
    )
}



/* 
              <TouchableOpacity onPress={() => setRoutineMenuOpen(true)}>
                <Text style={styles.titleText}>{routineList[currentRoutineIdx].title}</Text> 
              </TouchableOpacity> 
              <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {routineList.map((routine, index) => (
                  <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                      <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                  </View>
                ))}
                {openNewRoutineForm && 
                  <View>
                    <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                  </View>
                }
              </Modal>
              <Modal isVisible={routineMenuOpen}>
                <TouchableOpacity onPress={() => setRoutineMenuOpen(false)}>
                  <Icon name='close-outline' color={ICON_COLOR} size={30} style={styles.endButton} />
                </TouchableOpacity>
                <Button onPress={() => setOpenNewRoutineForm(true)} title="Create" />
                {routineList.map((routine, index) => (
                  <View key={"routine" + index}> 
                    <TouchableOpacity onPress={() => switchRoutines(index)}>
                      <Text>{routine.title}</Text> 
                    </TouchableOpacity>
                  </View>
                ))}
                {openNewRoutineForm && 
                  <View>
                    <TextInput
                      onChangeText={setNewRoutineInput}
                      value={newRoutineInput}
                    />
                    {invalidRoutineResponse && <Text>The name of your routine is invalid. Please try again.</Text>}
                    <Button onPress={() => handleNewRoutine(true)} title="Confirm" />
                    <Button onPress={() => handleNewRoutine(false)} title="Cancel" />
                  </View>
                }
              </Modal>


*/