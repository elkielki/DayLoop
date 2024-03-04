
const Circuit = ({circuitElement, handleCircuitDeletion}) => {
    const [circuit, setCircuit] = useState(null);

    useEffect(() => {
        setCircuit(circuitElement)
    }, [])

    const deleteCircuit = () => {
        handleCircuitDeletion(true)
    }

    return (
        <View>
            <button>Edit</button>
            {circuit.map((exercise, index) => (
                <View key={"circuitExercise" + index}>
                    <Text>{exercise.title}</Text>
                    <Text>{exercise.timer}</Text>
                    <button>Start</button>
                </View>
            ))}
            <button onClick={deleteCircuit}>Delete circuit</button>
        </View>
    )
}