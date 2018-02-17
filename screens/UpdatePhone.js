import React, { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { Container, Header, Body, Left, Button, Icon, Title, Form, Item, Input, Label, Content, Text, Right } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class UpdatePhonesScreen
 * @extends Component
 * @description Represents the screen to update a phone for a specific customer.
 */
export default class UpdatePhonesScreen extends Component {
    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        this.state = {
            name: params ? params.name : null,
            phone: params ? params.phone : null,
            number: params ? params.phone.number : null
        };
    }

    /**
     * 
     * @method UpdatePhonesScreen#update
     * @description Method that update a customer's phone from the database.
     */
    update() {
        let props = this.props;
        let id = this.state.phone.id;
        let number = this.state.number;
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('UPDATE phone SET number = ? WHERE id = ?;', [number, id]);
        Events.publish('RefreshNumbers');
        props.navigation.goBack();
    }

    errorCB(err) {
        console.error("SQLite3 Error: " + err);
    }

    openCB() {
        console.log("Database OPENED");
    }

    render() {
        let props = this.props;
        
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.name}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Telefone</Label>
                            <Input value={this.state.number} onChangeText={(number) => this.setState({ number })} />
                        </Item>
                    </Form>
                    <View style={{ margin: 15 }}>
                        <Button
                            full
                            danger
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    this.update();
                                }
                            }
                        >
                            <Text>Atualizar</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}