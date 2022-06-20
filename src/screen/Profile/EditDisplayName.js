/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useEffect, useState} from 'react';
import {Button, Modal, Flex, Input, Text} from 'native-base';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
import Constants, {setStorage} from '../../util/Constants';
import {getAccounts, getCurrentAccountIndex} from '../../util/script';
export default function Index({isOpen, onClose, displayName = ''}) {
  const dispatch = useDispatch();
  const save = async () => {
    dispatch(
      userSliceActions.updateUserInfo({
        userInfo: {name: value},
      }),
    );
    let accounts = await getAccounts();
    const currentAccountIndex = await getCurrentAccountIndex();
    accounts[currentAccountIndex].name = value;
    await setStorage(Constants.STORAGE.accounts, JSON.stringify(accounts));
    onClose();
  };
  const [value, setName] = useState(displayName);
  useEffect(() => {
    if (displayName !== value) {
      setName(displayName);
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Content>
        <Modal.Body>
          <Text bold fontSize={16} mb="12px">
            Edit Display Name
          </Text>
          <Input
            placeholder="Enter display name"
            value={value}
            onChangeText={setName}
            bg="#F5F5F5"
            borderWidth="0"
          />
          <Flex mt="22px" direction="row" justifyContent="space-between">
            <Button
              variant="outline"
              w="40%"
              borderRadius="30px"
              onPress={onClose}>
              Cancel
            </Button>
            <Button w="50%" borderRadius="30px" onPress={save}>
              Save
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
