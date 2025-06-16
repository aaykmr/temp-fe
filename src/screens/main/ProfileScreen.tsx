import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {updateProfile, getProfile} from '../../store/slices/authSlice';
import {userService} from '../../services/userService';
import Icon from 'react-native-vector-icons/Ionicons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Slider from '@react-native-community/slider';

export default function ProfileScreen() {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 30]);
  const [distance, setDistance] = useState(10);

  useEffect(() => {
    if (user?.id) {
      dispatch(getProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const handleUpdateProfile = async (data: any) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await dispatch(updateProfile({userId: user.id, data}));
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocationPreferences = async (data: any) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await userService.updateLocationPreferences(data);
      await dispatch(updateProfile({userId: user.id, data: response.data}));
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update preferences',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {user?.photoUrl ? (
            <Image source={{uri: user.photoUrl}} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Icon name="person" size={50} color="#666" />
            </View>
          )}
          <TouchableOpacity style={styles.editPhotoButton} disabled={loading}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.bio}>{user?.bio || 'No bio yet'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {user?.interests?.map((interest: string) => (
            <View key={interest} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Age Range</Text>
          <Text style={styles.preferenceValue}>
            {ageRange[0]} - {ageRange[1]}
          </Text>
        </View>
        <MultiSlider
          values={ageRange}
          min={18}
          max={70}
          onValuesChange={setAgeRange}
          step={1}
          allowOverlap={false}
          markerStyle={styles.sliderPointer}
          selectedStyle={styles.sliderSelected}
          unselectedStyle={styles.sliderUnselected}
          containerStyle={styles.slidercontainer}
          trackStyle={styles.sliderTrack}
          snapped
        />
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Distance</Text>
          <Text style={styles.preferenceValue}>{distance} km</Text>
        </View>

        <Slider
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={distance}
          onValueChange={setDistance}
          style={{width: 215, height: 40}}
        />
      </View>

      <TouchableOpacity
        style={[styles.editButton, loading && styles.buttonDisabled]}
        onPress={() => setIsEditing(true)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.editButtonText}>Edit Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF4B6E',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#FF4B6E',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderPointer: {
    backgroundColor: 'rgb(0, 150, 136)',
    borderColor: 'rgb(0, 150, 136)',
    boxShadow: 'none',
    marginTop: 2,
    width: 20,
    height: 20,
  },
  sliderSelected: {
    backgroundColor: 'rgb(0, 150, 136)',
    borderColor: 'rgb(0, 150, 136)',
    boxShadow: 'none',
    height: 4,
  },
  sliderUnselected: {
    backgroundColor: 'rgb(147, 147, 147)',
    borderColor: 'rgb(147, 147, 147)',
    boxShadow: 'none',
    height: 4,
  },
  slidercontainer: {
    marginLeft: 5,
    width: 200,
  },
  sliderTrack: {
    width: 200,
  },
});
