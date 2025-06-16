import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {
  findMatch,
  getCurrentMatch,
  extendMatch,
} from '../../store/slices/matchSlice';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MatchesScreen() {
  const {currentMatch, loading} = useSelector(
    (state: RootState) => state.match,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentMatch) {
      handleFindMatch();
    }
  }, []);

  const handleFindMatch = async () => {
    try {
      await dispatch(findMatch());
    } catch (error) {
      Alert.alert('Error', 'Failed to find a match. Please try again.');
    }
  };

  const handleExtendMatch = async () => {
    if (!currentMatch) return;
    try {
      await dispatch(extendMatch(currentMatch.id));
      Alert.alert('Success', 'Match extended for another week!');
    } catch (error) {
      Alert.alert('Error', 'Failed to extend match. Please try again.');
    }
  };

  const renderMatchCard = () => {
    if (!currentMatch) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="heart" size={50} color="#ddd" />
          <Text style={styles.emptyText}>No active matches</Text>
          <TouchableOpacity
            style={styles.findButton}
            onPress={handleFindMatch}
            disabled={loading}>
            <Text style={styles.findButtonText}>
              {loading ? 'Finding...' : 'Find a Match'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.matchCard}>
        <View style={styles.photoContainer}>
          {currentMatch.isPhotoRevealed ? (
            <Image
              source={{uri: currentMatch.matchedUser.photo}}
              style={styles.photo}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="person" size={50} color="#666" />
            </View>
          )}
        </View>
        <Text style={styles.name}>
          {currentMatch.isPhotoRevealed
            ? currentMatch.matchedUser.name
            : 'Mystery Match'}
        </Text>
        <Text style={styles.bio}>
          {currentMatch.isPhotoRevealed
            ? currentMatch.matchedUser.bio
            : 'Photo will be revealed in 7 days'}
        </Text>
        <View style={styles.interestsContainer}>
          {currentMatch.matchedUser.interests?.map((interest: string) => (
            <View key={interest} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExtendMatch}>
            <Icon name="time" size={24} color="#FF4B6E" />
            <Text style={styles.actionButtonText}>Extend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubbles" size={24} color="#FF4B6E" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={currentMatch ? [currentMatch] : []}
        renderItem={renderMatchCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  findButton: {
    backgroundColor: '#FF4B6E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FF4B6E',
    marginTop: 5,
    fontSize: 14,
  },
});
