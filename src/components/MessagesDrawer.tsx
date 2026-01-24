'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import Image from 'next/image';

interface AttachedFile {
    id: number;
    file: File;
    preview: string | null;
    type: 'image' | 'video' | 'pdf';
}

interface Freelancer {
    id: number;
    name: string;
    avatar: string;
}

interface MessagesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFreelancer: Freelancer | null;
}

interface MessageAttachment {
    name: string;
    type: 'image' | 'video' | 'pdf';
    preview: string | null;
}

interface Message {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
    attachments?: MessageAttachment[];
    replyTo?: {
        id: number;
        text: string;
        sender: 'me' | 'them';
    };
}

interface Conversation {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    online: boolean;
    role: string;
}

const conversations: Conversation[] = [
    {
        id: 1,
        name: 'Jan Mayer',
        avatar: '/images/community/bg-1.png',
        lastMessage: 'We want to invite you for a quick interview',
        time: '12 mins ago',
        online: true,
        role: 'Recruiter at Nomad'
    },
    {
        id: 2,
        name: 'Joe Bartmann',
        avatar: '/images/community/bg-2.png',
        lastMessage: 'Hey thanks for your interview...',
        time: '3:40 PM',
        online: false,
        role: 'Product Lead'
    },
    {
        id: 3,
        name: 'Ally Wales',
        avatar: '/images/community/bg-3.png',
        lastMessage: 'Can you share your portfolio?',
        time: 'Yesterday',
        online: true,
        role: 'Talent Scout'
    },
];

const mockMessages: Message[] = [
    { id: 1, sender: 'them', text: 'Hey, I wanted to reach out because we saw your work and were impressed!', time: '12 mins ago' },
    { id: 2, sender: 'them', text: 'We want to invite you for a quick interview', time: '12 mins ago' },
    { id: 3, sender: 'me', text: 'Hi! Sure, I would love to. Thanks for reaching out!', time: 'Now' }
];

interface StickerCategory {
    name: string;
    icon: string;
    stickers: { emoji: string; keywords: string[] }[];
}

const STICKER_CATEGORIES: StickerCategory[] = [
    {
        name: 'Smileys',
        icon: '😀',
        stickers: [
            { emoji: '😀', keywords: ['smile', 'happy', 'grin'] },
            { emoji: '😃', keywords: ['smile', 'happy', 'joy'] },
            { emoji: '😄', keywords: ['smile', 'happy', 'laugh'] },
            { emoji: '😁', keywords: ['grin', 'happy', 'beam'] },
            { emoji: '😅', keywords: ['sweat', 'nervous', 'relief'] },
            { emoji: '😂', keywords: ['laugh', 'funny', 'lol', 'haha', 'joy', 'tears'] },
            { emoji: '🤣', keywords: ['rofl', 'laugh', 'funny', 'rolling'] },
            { emoji: '😊', keywords: ['blush', 'happy', 'smile', 'cute'] },
            { emoji: '😇', keywords: ['angel', 'innocent', 'halo'] },
            { emoji: '🙂', keywords: ['smile', 'slight', 'okay'] },
            { emoji: '😉', keywords: ['wink', 'flirt', 'joke'] },
            { emoji: '😌', keywords: ['relieved', 'calm', 'peaceful'] },
            { emoji: '😍', keywords: ['love', 'heart eyes', 'crush', 'adore'] },
            { emoji: '🥰', keywords: ['love', 'hearts', 'adore', 'affection'] },
            { emoji: '😘', keywords: ['kiss', 'love', 'blow kiss'] },
            { emoji: '😋', keywords: ['yummy', 'delicious', 'tasty', 'tongue'] },
            { emoji: '😎', keywords: ['cool', 'sunglasses', 'awesome', 'chill'] },
            { emoji: '🤩', keywords: ['star', 'excited', 'wow', 'amazing'] },
            { emoji: '🥳', keywords: ['party', 'celebrate', 'birthday', 'fun'] },
            { emoji: '😏', keywords: ['smirk', 'flirt', 'sly', 'suggestive'] },
            { emoji: '😒', keywords: ['unamused', 'meh', 'bored', 'annoyed'] },
            { emoji: '😞', keywords: ['sad', 'disappointed', 'down'] },
            { emoji: '😔', keywords: ['sad', 'pensive', 'down'] },
            { emoji: '😟', keywords: ['worried', 'concerned', 'anxious'] },
            { emoji: '😕', keywords: ['confused', 'unsure', 'puzzled'] },
            { emoji: '🙁', keywords: ['sad', 'frown', 'unhappy'] },
            { emoji: '😣', keywords: ['persevere', 'struggle', 'pain'] },
            { emoji: '😖', keywords: ['confounded', 'frustrated'] },
            { emoji: '😫', keywords: ['tired', 'exhausted', 'weary'] },
            { emoji: '😩', keywords: ['weary', 'tired', 'frustrated'] },
            { emoji: '🥺', keywords: ['pleading', 'puppy', 'cute', 'please', 'sad'] },
            { emoji: '😢', keywords: ['cry', 'sad', 'tear'] },
            { emoji: '😭', keywords: ['cry', 'crying', 'sad', 'tears', 'sob'] },
            { emoji: '😤', keywords: ['angry', 'frustrated', 'mad', 'huff'] },
            { emoji: '😠', keywords: ['angry', 'mad', 'grumpy'] },
            { emoji: '😡', keywords: ['rage', 'angry', 'furious', 'mad'] },
            { emoji: '🤬', keywords: ['swear', 'curse', 'angry', 'symbols'] },
            { emoji: '😈', keywords: ['devil', 'evil', 'horns', 'mischief'] },
            { emoji: '👿', keywords: ['devil', 'angry', 'evil'] },
            { emoji: '💀', keywords: ['skull', 'dead', 'death', 'skeleton'] },
            { emoji: '👻', keywords: ['ghost', 'boo', 'spooky', 'halloween'] },
            { emoji: '🤡', keywords: ['clown', 'funny', 'joker', 'circus'] },
            { emoji: '💩', keywords: ['poop', 'poo', 'crap'] },
            { emoji: '🤔', keywords: ['think', 'thinking', 'hmm', 'wonder', 'curious'] },
            { emoji: '🤫', keywords: ['shush', 'quiet', 'secret', 'ssh'] },
            { emoji: '🤭', keywords: ['oops', 'giggle', 'cover', 'shy'] },
            { emoji: '🤯', keywords: ['mind blown', 'explode', 'shock', 'wow', 'amazing'] },
            { emoji: '😱', keywords: ['scream', 'shock', 'scared', 'omg', 'fear'] },
            { emoji: '😴', keywords: ['sleep', 'tired', 'zzz', 'snore'] },
            { emoji: '🤮', keywords: ['vomit', 'sick', 'gross', 'puke'] },
            { emoji: '🥴', keywords: ['woozy', 'drunk', 'dizzy', 'tipsy'] },
            { emoji: '😵', keywords: ['dizzy', 'dead', 'knocked out'] },
            { emoji: '🤠', keywords: ['cowboy', 'western', 'hat', 'yeehaw'] },
        ]
    },
    {
        name: 'Gestures',
        icon: '👋',
        stickers: [
            { emoji: '👋', keywords: ['wave', 'hello', 'hi', 'bye', 'hand'] },
            { emoji: '🤚', keywords: ['raised hand', 'stop', 'high five'] },
            { emoji: '🖐️', keywords: ['hand', 'five', 'fingers', 'palm'] },
            { emoji: '✋', keywords: ['hand', 'stop', 'high five'] },
            { emoji: '🖖', keywords: ['vulcan', 'spock', 'star trek'] },
            { emoji: '👌', keywords: ['ok', 'perfect', 'good', 'nice'] },
            { emoji: '🤌', keywords: ['pinched', 'italian', 'chef kiss'] },
            { emoji: '🤏', keywords: ['pinch', 'small', 'tiny', 'little'] },
            { emoji: '✌️', keywords: ['peace', 'victory', 'two'] },
            { emoji: '🤞', keywords: ['fingers crossed', 'luck', 'hope'] },
            { emoji: '🤟', keywords: ['love you', 'rock', 'sign'] },
            { emoji: '🤘', keywords: ['rock', 'metal', 'horns'] },
            { emoji: '🤙', keywords: ['call me', 'shaka', 'hang loose'] },
            { emoji: '👈', keywords: ['point left', 'direction', 'left'] },
            { emoji: '👉', keywords: ['point right', 'direction', 'right'] },
            { emoji: '👆', keywords: ['point up', 'direction', 'up'] },
            { emoji: '👇', keywords: ['point down', 'direction', 'down'] },
            { emoji: '☝️', keywords: ['point up', 'one', 'index'] },
            { emoji: '👍', keywords: ['thumbs up', 'like', 'yes', 'good', 'ok', 'approve'] },
            { emoji: '👎', keywords: ['thumbs down', 'dislike', 'no', 'bad', 'disapprove'] },
            { emoji: '✊', keywords: ['fist', 'power', 'solidarity'] },
            { emoji: '👊', keywords: ['fist bump', 'punch', 'bro'] },
            { emoji: '🤛', keywords: ['fist', 'left', 'bump'] },
            { emoji: '🤜', keywords: ['fist', 'right', 'bump'] },
            { emoji: '👏', keywords: ['clap', 'applause', 'bravo'] },
            { emoji: '🙌', keywords: ['raise', 'celebration', 'hands up', 'praise'] },
            { emoji: '👐', keywords: ['open hands', 'jazz hands'] },
            { emoji: '🤲', keywords: ['palms up', 'prayer', 'receive'] },
            { emoji: '🤝', keywords: ['handshake', 'deal', 'agreement'] },
            { emoji: '🙏', keywords: ['pray', 'please', 'thanks', 'hope', 'hands'] },
            { emoji: '💪', keywords: ['muscle', 'strong', 'power', 'flex', 'arm'] },
            { emoji: '🦾', keywords: ['robot arm', 'prosthetic', 'strong'] },
            { emoji: '🖕', keywords: ['middle finger', 'rude'] },
            { emoji: '✍️', keywords: ['writing', 'write', 'hand'] },
            { emoji: '🤳', keywords: ['selfie', 'photo', 'phone'] },
        ]
    },
    {
        name: 'Hearts',
        icon: '❤️',
        stickers: [
            { emoji: '❤️', keywords: ['heart', 'love', 'like', 'red'] },
            { emoji: '🧡', keywords: ['heart', 'orange', 'love'] },
            { emoji: '💛', keywords: ['heart', 'yellow', 'love'] },
            { emoji: '💚', keywords: ['heart', 'green', 'love'] },
            { emoji: '💙', keywords: ['heart', 'blue', 'love'] },
            { emoji: '💜', keywords: ['heart', 'purple', 'love'] },
            { emoji: '🖤', keywords: ['heart', 'black', 'love'] },
            { emoji: '🤍', keywords: ['heart', 'white', 'love'] },
            { emoji: '🤎', keywords: ['heart', 'brown', 'love'] },
            { emoji: '💔', keywords: ['broken heart', 'sad', 'heartbreak'] },
            { emoji: '❤️‍🔥', keywords: ['heart fire', 'passion', 'burning love'] },
            { emoji: '❤️‍🩹', keywords: ['mending heart', 'healing', 'recovery'] },
            { emoji: '💕', keywords: ['two hearts', 'love', 'affection'] },
            { emoji: '💞', keywords: ['revolving hearts', 'love'] },
            { emoji: '💓', keywords: ['beating heart', 'love', 'pulse'] },
            { emoji: '💗', keywords: ['growing heart', 'love'] },
            { emoji: '💖', keywords: ['sparkling heart', 'love'] },
            { emoji: '💘', keywords: ['cupid', 'arrow', 'love'] },
            { emoji: '💝', keywords: ['gift heart', 'love', 'present'] },
            { emoji: '💟', keywords: ['heart decoration', 'love'] },
        ]
    },
    {
        name: 'Celebrations',
        icon: '🎉',
        stickers: [
            { emoji: '🎉', keywords: ['party', 'celebrate', 'congrats', 'confetti'] },
            { emoji: '🎊', keywords: ['confetti ball', 'party', 'celebrate'] },
            { emoji: '🎈', keywords: ['balloon', 'party', 'birthday'] },
            { emoji: '🎂', keywords: ['cake', 'birthday', 'celebrate'] },
            { emoji: '🎁', keywords: ['gift', 'present', 'birthday'] },
            { emoji: '🎀', keywords: ['ribbon', 'gift', 'bow'] },
            { emoji: '🏆', keywords: ['trophy', 'winner', 'champion', 'award', 'first'] },
            { emoji: '🥇', keywords: ['gold', 'medal', 'first', 'winner'] },
            { emoji: '🥈', keywords: ['silver', 'medal', 'second'] },
            { emoji: '🥉', keywords: ['bronze', 'medal', 'third'] },
            { emoji: '🏅', keywords: ['medal', 'sports', 'winner'] },
            { emoji: '🎖️', keywords: ['military medal', 'honor'] },
            { emoji: '🎯', keywords: ['target', 'goal', 'bullseye', 'aim', 'hit'] },
            { emoji: '🎪', keywords: ['circus', 'tent', 'show'] },
            { emoji: '🎭', keywords: ['theater', 'drama', 'masks'] },
            { emoji: '🎨', keywords: ['art', 'palette', 'paint'] },
            { emoji: '✨', keywords: ['sparkle', 'shine', 'magic', 'stars', 'glitter'] },
            { emoji: '🌟', keywords: ['star', 'shine', 'glow', 'bright'] },
            { emoji: '⭐', keywords: ['star', 'favorite', 'rating', 'yellow'] },
            { emoji: '💫', keywords: ['dizzy', 'star', 'magic', 'sparkle'] },
            { emoji: '🔥', keywords: ['fire', 'hot', 'lit', 'flame', 'trending'] },
            { emoji: '💥', keywords: ['boom', 'explosion', 'collision'] },
            { emoji: '💯', keywords: ['hundred', '100', 'perfect', 'score'] },
        ]
    },
    {
        name: 'Animals',
        icon: '🐶',
        stickers: [
            { emoji: '🐶', keywords: ['dog', 'puppy', 'pet', 'cute'] },
            { emoji: '🐱', keywords: ['cat', 'kitten', 'pet', 'cute'] },
            { emoji: '🐭', keywords: ['mouse', 'rat', 'rodent'] },
            { emoji: '🐹', keywords: ['hamster', 'pet', 'cute'] },
            { emoji: '🐰', keywords: ['rabbit', 'bunny', 'cute'] },
            { emoji: '🦊', keywords: ['fox', 'animal', 'cute'] },
            { emoji: '🐻', keywords: ['bear', 'animal', 'teddy'] },
            { emoji: '🐼', keywords: ['panda', 'bear', 'cute'] },
            { emoji: '🐨', keywords: ['koala', 'animal', 'cute'] },
            { emoji: '🐯', keywords: ['tiger', 'cat', 'animal'] },
            { emoji: '🦁', keywords: ['lion', 'king', 'animal'] },
            { emoji: '🐮', keywords: ['cow', 'animal', 'moo'] },
            { emoji: '🐷', keywords: ['pig', 'animal', 'oink'] },
            { emoji: '🐸', keywords: ['frog', 'animal', 'ribbit'] },
            { emoji: '🐵', keywords: ['monkey', 'animal', 'ape'] },
            { emoji: '🙈', keywords: ['monkey', 'see no evil', 'shy'] },
            { emoji: '🙉', keywords: ['monkey', 'hear no evil'] },
            { emoji: '🙊', keywords: ['monkey', 'speak no evil', 'oops'] },
            { emoji: '🐔', keywords: ['chicken', 'bird', 'animal'] },
            { emoji: '🐧', keywords: ['penguin', 'bird', 'cute'] },
            { emoji: '🐦', keywords: ['bird', 'tweet', 'animal'] },
            { emoji: '🦅', keywords: ['eagle', 'bird', 'freedom'] },
            { emoji: '🦆', keywords: ['duck', 'bird', 'quack'] },
            { emoji: '🦉', keywords: ['owl', 'bird', 'wise'] },
            { emoji: '🦇', keywords: ['bat', 'halloween', 'animal'] },
            { emoji: '🐺', keywords: ['wolf', 'animal', 'howl'] },
            { emoji: '🐗', keywords: ['boar', 'pig', 'wild'] },
            { emoji: '🐴', keywords: ['horse', 'animal'] },
            { emoji: '🦄', keywords: ['unicorn', 'magic', 'fantasy'] },
            { emoji: '🐝', keywords: ['bee', 'insect', 'honey'] },
            { emoji: '🦋', keywords: ['butterfly', 'insect', 'pretty'] },
            { emoji: '🐌', keywords: ['snail', 'slow', 'animal'] },
            { emoji: '🐛', keywords: ['bug', 'insect', 'caterpillar'] },
            { emoji: '🐢', keywords: ['turtle', 'slow', 'animal'] },
            { emoji: '🐍', keywords: ['snake', 'reptile', 'animal'] },
            { emoji: '🦎', keywords: ['lizard', 'reptile', 'animal'] },
            { emoji: '🦈', keywords: ['shark', 'fish', 'ocean'] },
            { emoji: '🐙', keywords: ['octopus', 'ocean', 'animal'] },
            { emoji: '🐠', keywords: ['fish', 'ocean', 'animal'] },
            { emoji: '🐬', keywords: ['dolphin', 'ocean', 'animal'] },
            { emoji: '🐳', keywords: ['whale', 'ocean', 'animal'] },
        ]
    },
    {
        name: 'Food',
        icon: '🍕',
        stickers: [
            { emoji: '🍕', keywords: ['pizza', 'food', 'italian'] },
            { emoji: '🍔', keywords: ['burger', 'food', 'fast food'] },
            { emoji: '🍟', keywords: ['fries', 'food', 'fast food'] },
            { emoji: '🌭', keywords: ['hot dog', 'food'] },
            { emoji: '🍿', keywords: ['popcorn', 'movie', 'snack'] },
            { emoji: '🧀', keywords: ['cheese', 'food'] },
            { emoji: '🥪', keywords: ['sandwich', 'food', 'lunch'] },
            { emoji: '🌮', keywords: ['taco', 'mexican', 'food'] },
            { emoji: '🌯', keywords: ['burrito', 'mexican', 'food'] },
            { emoji: '🥗', keywords: ['salad', 'healthy', 'food'] },
            { emoji: '🍝', keywords: ['pasta', 'spaghetti', 'italian'] },
            { emoji: '🍜', keywords: ['noodles', 'ramen', 'asian'] },
            { emoji: '🍣', keywords: ['sushi', 'japanese', 'food'] },
            { emoji: '🍱', keywords: ['bento', 'japanese', 'food'] },
            { emoji: '🍛', keywords: ['curry', 'rice', 'food'] },
            { emoji: '🍳', keywords: ['egg', 'breakfast', 'cooking'] },
            { emoji: '🥚', keywords: ['egg', 'food'] },
            { emoji: '🍞', keywords: ['bread', 'food', 'toast'] },
            { emoji: '🥐', keywords: ['croissant', 'french', 'pastry'] },
            { emoji: '🍰', keywords: ['cake', 'dessert', 'sweet'] },
            { emoji: '🎂', keywords: ['birthday cake', 'celebrate'] },
            { emoji: '🧁', keywords: ['cupcake', 'dessert', 'sweet'] },
            { emoji: '🍩', keywords: ['donut', 'dessert', 'sweet'] },
            { emoji: '🍪', keywords: ['cookie', 'dessert', 'sweet'] },
            { emoji: '🍫', keywords: ['chocolate', 'candy', 'sweet'] },
            { emoji: '🍬', keywords: ['candy', 'sweet'] },
            { emoji: '🍭', keywords: ['lollipop', 'candy', 'sweet'] },
            { emoji: '🍦', keywords: ['ice cream', 'dessert', 'sweet'] },
            { emoji: '☕', keywords: ['coffee', 'drink', 'hot'] },
            { emoji: '🍵', keywords: ['tea', 'drink', 'hot'] },
            { emoji: '🥤', keywords: ['soda', 'drink', 'cup'] },
            { emoji: '🍺', keywords: ['beer', 'drink', 'alcohol'] },
            { emoji: '🍻', keywords: ['cheers', 'beer', 'drink'] },
            { emoji: '🥂', keywords: ['champagne', 'cheers', 'celebrate'] },
            { emoji: '🍷', keywords: ['wine', 'drink', 'alcohol'] },
            { emoji: '🍸', keywords: ['cocktail', 'drink', 'martini'] },
        ]
    },
    {
        name: 'Tech',
        icon: '💻',
        stickers: [
            { emoji: '💻', keywords: ['laptop', 'computer', 'work', 'code'] },
            { emoji: '🖥️', keywords: ['desktop', 'computer', 'monitor', 'screen'] },
            { emoji: '🖨️', keywords: ['printer', 'print', 'office'] },
            { emoji: '⌨️', keywords: ['keyboard', 'type', 'typing', 'keys'] },
            { emoji: '🖱️', keywords: ['mouse', 'computer', 'click'] },
            { emoji: '💽', keywords: ['disk', 'computer', 'storage'] },
            { emoji: '💾', keywords: ['floppy', 'save', 'disk'] },
            { emoji: '💿', keywords: ['cd', 'disk', 'music'] },
            { emoji: '📱', keywords: ['phone', 'mobile', 'cell', 'smartphone'] },
            { emoji: '📲', keywords: ['phone', 'call', 'incoming'] },
            { emoji: '☎️', keywords: ['telephone', 'call', 'phone'] },
            { emoji: '📞', keywords: ['phone', 'call', 'receiver'] },
            { emoji: '📟', keywords: ['pager', 'beeper'] },
            { emoji: '📠', keywords: ['fax', 'machine', 'office'] },
            { emoji: '🔋', keywords: ['battery', 'power', 'charge'] },
            { emoji: '🔌', keywords: ['plug', 'electric', 'power'] },
            { emoji: '💡', keywords: ['idea', 'light', 'bulb', 'think', 'bright'] },
            { emoji: '🔦', keywords: ['flashlight', 'light', 'torch'] },
            { emoji: '📷', keywords: ['camera', 'photo', 'picture'] },
            { emoji: '📸', keywords: ['camera flash', 'photo'] },
            { emoji: '📹', keywords: ['video camera', 'record'] },
            { emoji: '🎥', keywords: ['movie camera', 'film'] },
            { emoji: '📺', keywords: ['tv', 'television', 'watch'] },
            { emoji: '📻', keywords: ['radio', 'music', 'listen'] },
            { emoji: '🎧', keywords: ['headphones', 'music', 'listen', 'audio'] },
            { emoji: '🎤', keywords: ['microphone', 'sing', 'karaoke'] },
            { emoji: '🎮', keywords: ['game', 'gaming', 'controller', 'play', 'video'] },
            { emoji: '🕹️', keywords: ['joystick', 'game', 'arcade'] },
            { emoji: '🎰', keywords: ['slot machine', 'casino', 'gamble'] },
            { emoji: '🔧', keywords: ['wrench', 'tool', 'fix', 'repair', 'settings'] },
            { emoji: '🔨', keywords: ['hammer', 'tool', 'build'] },
            { emoji: '⚙️', keywords: ['gear', 'settings', 'cog'] },
            { emoji: '🔩', keywords: ['nut bolt', 'hardware'] },
            { emoji: '⚡', keywords: ['lightning', 'electric', 'power', 'fast', 'energy'] },
            { emoji: '🚀', keywords: ['rocket', 'launch', 'fast', 'speed', 'ship'] },
            { emoji: '🛸', keywords: ['ufo', 'alien', 'spaceship'] },
        ]
    },
    {
        name: 'Symbols',
        icon: '✅',
        stickers: [
            { emoji: '✅', keywords: ['check', 'done', 'complete', 'yes', 'correct', 'tick'] },
            { emoji: '❌', keywords: ['cross', 'no', 'wrong', 'delete', 'cancel', 'x'] },
            { emoji: '⭕', keywords: ['circle', 'red', 'o'] },
            { emoji: '❗', keywords: ['exclamation', 'important', 'alert'] },
            { emoji: '❓', keywords: ['question', 'what', 'help'] },
            { emoji: '❕', keywords: ['exclamation', 'white'] },
            { emoji: '❔', keywords: ['question', 'white'] },
            { emoji: '⚠️', keywords: ['warning', 'alert', 'caution', 'danger'] },
            { emoji: '🚫', keywords: ['prohibited', 'no', 'forbidden'] },
            { emoji: '⛔', keywords: ['stop', 'no entry', 'forbidden'] },
            { emoji: '📛', keywords: ['name badge', 'id'] },
            { emoji: '🔴', keywords: ['red circle', 'dot'] },
            { emoji: '🟠', keywords: ['orange circle', 'dot'] },
            { emoji: '🟡', keywords: ['yellow circle', 'dot'] },
            { emoji: '🟢', keywords: ['green circle', 'dot'] },
            { emoji: '🔵', keywords: ['blue circle', 'dot'] },
            { emoji: '🟣', keywords: ['purple circle', 'dot'] },
            { emoji: '⚫', keywords: ['black circle', 'dot'] },
            { emoji: '⚪', keywords: ['white circle', 'dot'] },
            { emoji: '🔺', keywords: ['red triangle', 'up'] },
            { emoji: '🔻', keywords: ['red triangle', 'down'] },
            { emoji: '🔷', keywords: ['blue diamond', 'large'] },
            { emoji: '🔶', keywords: ['orange diamond', 'large'] },
            { emoji: '📌', keywords: ['pin', 'location', 'mark', 'pushpin'] },
            { emoji: '📍', keywords: ['pin', 'location', 'map'] },
            { emoji: '🔗', keywords: ['link', 'chain', 'connect', 'url'] },
            { emoji: '📎', keywords: ['paperclip', 'attach', 'clip', 'attachment'] },
            { emoji: '✏️', keywords: ['pencil', 'write', 'edit', 'draw'] },
            { emoji: '✒️', keywords: ['pen', 'write'] },
            { emoji: '🔒', keywords: ['lock', 'secure', 'private'] },
            { emoji: '🔓', keywords: ['unlock', 'open'] },
            { emoji: '🔑', keywords: ['key', 'lock', 'password'] },
            { emoji: '💰', keywords: ['money', 'cash', 'bag', 'rich', 'dollar'] },
            { emoji: '💵', keywords: ['money', 'dollar', 'cash'] },
            { emoji: '💸', keywords: ['money', 'flying', 'spend'] },
            { emoji: '👀', keywords: ['eyes', 'look', 'see', 'watch', 'stare'] },
        ]
    },
];

export default function MessagesDrawer({ isOpen, onClose, activeFreelancer }: MessagesDrawerProps) {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [showStickers, setShowStickers] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSidebarSearch, setShowSidebarSearch] = useState(false);
    const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
    const [stickerSearchQuery, setStickerSearchQuery] = useState('');
    const [activeStickerCategory, setActiveStickerCategory] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const sidebarSearchInputRef = useRef<HTMLInputElement>(null);
    const stickerContainerRef = useRef<HTMLDivElement>(null);
    const stickerSearchRef = useRef<HTMLInputElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dragControls = useDragControls();

    // Auto-resize textarea up to 3 lines
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const lineHeight = 20; // approximate line height in px
            const maxHeight = lineHeight * 3 + 24; // 3 lines + padding
            textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
        }
    };

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            }
        }, 100);
    };

    // Toggle search
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchQuery('');
        }
    };

    // Render text with larger emojis
    const renderTextWithEmojis = (text: string) => {
        // Regex to match emoji characters
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
        const parts = text.split(emojiRegex);
        return parts.map((part, i) =>
            emojiRegex.test(part) ? <span key={i} className="sticker-emoji">{part}</span> : part
        );
    };

    // Highlight search matches in text
    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return renderTextWithEmojis(text);
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : renderTextWithEmojis(part)
        );
    };

    // Filter messages based on search
    const filteredMessages = searchQuery.trim()
        ? messages.filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : messages;

    // Filter conversations based on sidebar search
    const filteredConversations = sidebarSearchQuery.trim()
        ? conversations.filter(conv =>
            conv.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
        )
        : conversations;

    // Filter stickers based on search
    const getFilteredStickers = () => {
        if (stickerSearchQuery.trim()) {
            // When searching, search across all categories
            const allStickers: { emoji: string; keywords: string[] }[] = [];
            STICKER_CATEGORIES.forEach(cat => {
                cat.stickers.forEach(sticker => {
                    if (
                        sticker.emoji.includes(stickerSearchQuery) ||
                        sticker.keywords.some(kw => kw.toLowerCase().includes(stickerSearchQuery.toLowerCase()))
                    ) {
                        allStickers.push(sticker);
                    }
                });
            });
            return allStickers;
        }
        return null; // Return null to show categories view
    };

    const filteredStickers = getFilteredStickers();

    // Handle key press in textarea
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (isMobile) {
                // Mobile: Enter creates new line, use send button to send
                return;
            } else {
                // Desktop: Shift+Enter creates new line, Enter sends
                if (e.shiftKey) {
                    return; // Allow new line
                } else {
                    e.preventDefault();
                    handleSend();
                }
            }
        }
    };

    // Close sticker picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (stickerContainerRef.current && !stickerContainerRef.current.contains(event.target as Node)) {
                setShowStickers(false);
                setStickerSearchQuery('');
                setActiveStickerCategory(null);
            }
        };

        if (showStickers) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStickers]);

    const handleStickerClick = (sticker: string) => {
        setInputText(prev => prev + sticker);
        setShowStickers(false);
        setStickerSearchQuery('');
        setActiveStickerCategory(null);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: AttachedFile[] = [];

        Array.from(files).forEach((file) => {
            let fileType: 'image' | 'video' | 'pdf' | null = null;

            if (file.type.startsWith('image/')) {
                fileType = 'image';
            } else if (file.type.startsWith('video/')) {
                fileType = 'video';
            } else if (file.type === 'application/pdf') {
                fileType = 'pdf';
            }

            if (fileType) {
                const preview = fileType === 'image' ? URL.createObjectURL(file) : null;
                newFiles.push({
                    id: Date.now() + Math.random(),
                    file,
                    preview,
                    type: fileType,
                });
            }
        });

        setAttachedFiles(prev => [...prev, ...newFiles]);
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const removeAttachment = (id: number) => {
        setAttachedFiles(prev => {
            const file = prev.find(f => f.id === id);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter(f => f.id !== id);
        });
    };

    // When opened with a freelancer, select them
    useEffect(() => {
        if (isOpen && activeFreelancer) {
            setSelectedChat(-1); // -1 = new conversation with activeFreelancer
        }
    }, [isOpen, activeFreelancer]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSend = () => {
        if (!inputText.trim() && attachedFiles.length === 0) return;

        const newAttachments: MessageAttachment[] = attachedFiles.map(f => ({
            name: f.file.name,
            type: f.type,
            preview: f.preview,
        }));

        const newMessage: Message = {
            id: Date.now(),
            sender: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: newAttachments,
            replyTo: replyingTo ? {
                id: replyingTo.id,
                text: replyingTo.text,
                sender: replyingTo.sender
            } : undefined
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setAttachedFiles([]);
        setReplyingTo(null);
        scrollToBottom();
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const getActiveContact = () => {
        if (selectedChat === -1 && activeFreelancer) {
            return { ...activeFreelancer, role: 'Freelancer', online: true };
        }
        return conversations.find(c => c.id === selectedChat) || null;
    };

    const activeContact = getActiveContact();

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="messages-drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* Wrapper for Genie Effect */}
                    <div
                        style={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 9999,
                        }}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {/* Drawer */}
                        <motion.div
                            className="messages-drawer"
                            drag
                            dragControls={dragControls}
                            dragListener={false}
                            dragElastic={0}
                            dragMomentum={false}
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 30,
                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                            }}
                            exit={{
                                opacity: 0,
                                y: 300,
                                scaleY: 0.5,
                                scaleX: 0.6,
                                clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 85% 100%)',
                                transition: {
                                    duration: 0.5,
                                    ease: [0.4, 0, 0.2, 1],
                                    clipPath: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                    y: { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
                                    scaleY: { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.05 },
                                    scaleX: { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.05 },
                                    opacity: { duration: 0.3, delay: 0.2 }
                                }
                            }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                            }}
                            style={{
                                transformOrigin: 'right bottom',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                        {/* Close Button */}
                        <button className="messages-drawer-close btn-close-rotate" onClick={onClose} aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Sidebar - Conversation List */}
                        <div className="messages-sidebar">
                            <div
                                className="messages-sidebar-header"
                                onPointerDown={(e) => dragControls.start(e)}
                                style={{ cursor: 'grab' }}
                            >
                                <h3>Messages</h3>
                                <button
                                    className={`btn-sidebar-search ${showSidebarSearch ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSidebarSearch(!showSidebarSearch);
                                        if (!showSidebarSearch) {
                                            setTimeout(() => sidebarSearchInputRef.current?.focus(), 100);
                                        } else {
                                            setSidebarSearchQuery('');
                                        }
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                </button>
                            </div>
                            <AnimatePresence>
                                {showSidebarSearch && (
                                    <motion.div
                                        className="messages-search"
                                        initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                        exit={{ opacity: 0, y: -20, scaleY: 0.8 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="M21 21l-4.35-4.35" />
                                        </svg>
                                        <input
                                            ref={sidebarSearchInputRef}
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={sidebarSearchQuery}
                                            onChange={(e) => setSidebarSearchQuery(e.target.value)}
                                        />
                                        {sidebarSearchQuery && (
                                            <button
                                                className="search-clear"
                                                onClick={() => setSidebarSearchQuery('')}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="messages-list">
                                {/* Active Freelancer (if opened from card) */}
                                {activeFreelancer && (
                                    <motion.div
                                        className={`messages-item ${selectedChat === -1 ? 'active' : ''}`}
                                        onClick={() => setSelectedChat(-1)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="messages-item-avatar">
                                            <Image src={activeFreelancer.avatar} alt={activeFreelancer.name} fill style={{ objectFit: 'cover' }} />
                                            <span className="online-dot"></span>
                                        </div>
                                        <div className="messages-item-content">
                                            <span className="messages-item-name">{activeFreelancer.name}</span>
                                            <span className="messages-item-preview new">New conversation</span>
                                        </div>
                                        <span className="messages-item-time">Now</span>
                                    </motion.div>
                                )}
                                {/* Existing Conversations */}
                                {filteredConversations.map((conv, index) => (
                                    <motion.div
                                        key={conv.id}
                                        className={`messages-item ${selectedChat === conv.id ? 'active' : ''}`}
                                        onClick={() => setSelectedChat(conv.id)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (index * 0.05) }}
                                    >
                                        <div className="messages-item-avatar">
                                            <Image src={conv.avatar} alt={conv.name} fill style={{ objectFit: 'cover' }} />
                                            {conv.online && <span className="online-dot"></span>}
                                        </div>
                                        <div className="messages-item-content">
                                            <span className="messages-item-name">{conv.name}</span>
                                            <span className="messages-item-preview">{conv.lastMessage}</span>
                                        </div>
                                        <span className="messages-item-time">{conv.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="messages-chat">
                            {/* Background Pattern */}
                            <div className="messages-chat-pattern"></div>

                            {activeContact ? (
                                <>
                                    {/* Chat Header */}
                                    <div
                                        className="messages-chat-header"
                                        onPointerDown={(e) => dragControls.start(e)}
                                        style={{ cursor: 'grab' }}
                                    >
                                        <div className="messages-chat-user">
                                            <div className="messages-chat-avatar">
                                                <Image src={activeContact.avatar} alt={activeContact.name} fill style={{ objectFit: 'cover' }} />
                                            </div>
                                            <div className="messages-chat-info">
                                                <span className="messages-chat-name">{activeContact.name}</span>
                                                <span className="messages-chat-role">{activeContact.role}</span>
                                            </div>
                                        </div>
                                        <div className="messages-header-actions" onPointerDown={(e) => e.stopPropagation()}>
                                            <button
                                                className={`btn-header-action ${showSearch ? 'active' : ''}`}
                                                onClick={toggleSearch}
                                                aria-label="Search in chat"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35" />
                                                </svg>
                                            </button>
                                            <button className="btn-header-action" aria-label="Start voice call">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </button>
                                            <button className="btn-header-action" aria-label="Start video call">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M23 7l-7 5 7 5V7z" />
                                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Bar */}
                                    <AnimatePresence>
                                        {showSearch && (
                                            <motion.div
                                                className="messages-search-bar"
                                                initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                                exit={{ opacity: 0, y: -20, scaleY: 0.8 }}
                                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35" />
                                                </svg>
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Search messages..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                {searchQuery && (
                                                    <span className="search-count">
                                                        {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                <button className="search-close" onClick={toggleSearch}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Messages */}
                                    <div className="messages-chat-body" ref={chatBodyRef}>
                                        {selectedChat === -1 ? (
                                            <div className="messages-empty">
                                                <p>Start a conversation with {activeContact.name}</p>
                                            </div>
                                        ) : (
                                            filteredMessages.map((msg, index) => (
                                                <div key={msg.id} className={`message-group ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                                    {msg.sender !== 'me' && (
                                                        <div className="message-avatar">
                                                            <Image
                                                                src={activeContact.avatar}
                                                                alt={activeContact.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <motion.div
                                                        className={`message-bubble ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        {msg.replyTo && (
                                                            <div className="message-reply-preview">
                                                                <div className="reply-preview-bar"></div>
                                                                <div className="reply-preview-content">
                                                                    <span className="reply-preview-sender">
                                                                        {msg.replyTo.sender === 'me' ? 'You' : activeContact.name}
                                                                    </span>
                                                                    <p className="reply-preview-text">{msg.replyTo.text}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className="message-attachments-display">
                                                                {msg.attachments.map((att, i) => (
                                                                    <div key={i} className="message-attachment-item">
                                                                        {att.type === 'image' && att.preview && (
                                                                            <img src={att.preview} alt={att.name} className="attachment-img" />
                                                                        )}
                                                                        {att.type !== 'image' && (
                                                                            <div className={`attachment-icon-lg ${att.type}`}>
                                                                                <span className="attachment-ext">{att.type.toUpperCase()}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {msg.text && <p className="message-text">{searchQuery ? highlightText(msg.text, searchQuery) : renderTextWithEmojis(msg.text)}</p>}
                                                        <span className="message-time">{msg.time}</span>

                                                        <button
                                                            className="btn-reply-message"
                                                            onClick={() => setReplyingTo(msg)}
                                                            aria-label="Reply to message"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 10h10a5 5 0 0 1 5 5v6" />
                                                                <path d="M8 5L3 10l5 5" />
                                                            </svg>
                                                        </button>
                                                    </motion.div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Reply Banner */}
                                    {replyingTo && (
                                        <div className="reply-banner">
                                            <div className="reply-banner-content">
                                                <span className="reply-banner-title">
                                                    Replying to {replyingTo.sender === 'me' ? 'yourself' : activeContact.name}
                                                </span>
                                                <p className="reply-banner-text">{replyingTo.text}</p>
                                            </div>
                                            <button
                                                className="reply-banner-close"
                                                onClick={() => setReplyingTo(null)}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Attached Files Preview */}
                                    {attachedFiles.length > 0 && (
                                        <div className="messages-attachments">
                                            {attachedFiles.map((file) => (
                                                <div key={file.id} className="attachment-preview">
                                                    {file.type === 'image' && file.preview && (
                                                        <img src={file.preview} alt={file.file.name} />
                                                    )}
                                                    {file.type === 'video' && (
                                                        <div className="attachment-icon video">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polygon points="5 3 19 12 5 21 5 3" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {file.type === 'pdf' && (
                                                        <div className="attachment-icon pdf">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                <polyline points="14 2 14 8 20 8" />
                                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                                <line x1="16" y1="17" x2="8" y2="17" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <span className="attachment-name">{file.file.name}</span>
                                                    <button
                                                        className="attachment-remove"
                                                        onClick={() => removeAttachment(file.id)}
                                                        aria-label="Remove attachment"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Input Area */}
                                    <div className="messages-chat-input">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*,application/pdf"
                                            multiple
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <button className="messages-attach-btn" onClick={handleAttachClick} aria-label="Attach file">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                            </svg>
                                        </button>
                                        <textarea
                                            ref={textareaRef}
                                            placeholder="Type a message..."
                                            value={inputText}
                                            onChange={(e) => {
                                                setInputText(e.target.value);
                                                adjustTextareaHeight();
                                            }}
                                            onKeyDown={handleKeyDown}
                                            rows={1}
                                        />

                                        {/* Sticker Picker */}
                                        <div className="sticker-container" ref={stickerContainerRef} style={{ position: 'relative' }}>
                                            <button
                                                className={`messages-sticker-btn ${showStickers ? 'active' : ''}`}
                                                onClick={() => {
                                                    const newState = !showStickers;
                                                    setShowStickers(newState);
                                                    if (newState) {
                                                        setTimeout(() => stickerSearchRef.current?.focus(), 100);
                                                    } else {
                                                        setStickerSearchQuery('');
                                                        setActiveStickerCategory(null);
                                                    }
                                                }}
                                                aria-label="Send sticker"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                    <line x1="9" y1="9" x2="9.01" y2="9" />
                                                    <line x1="15" y1="9" x2="15.01" y2="9" />
                                                </svg>
                                            </button>

                                            {showStickers && (
                                                <div className="sticker-picker">
                                                    <div className="sticker-search">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="11" cy="11" r="8" />
                                                            <path d="M21 21l-4.35-4.35" />
                                                        </svg>
                                                        <input
                                                            ref={stickerSearchRef}
                                                            type="text"
                                                            placeholder="Search stickers..."
                                                            value={stickerSearchQuery}
                                                            onChange={(e) => setStickerSearchQuery(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>

                                                    {/* Category Tabs */}
                                                    {!stickerSearchQuery.trim() && (
                                                        <div className="sticker-category-tabs">
                                                            {STICKER_CATEGORIES.map((cat) => (
                                                                <button
                                                                    key={cat.name}
                                                                    className={`sticker-category-tab ${activeStickerCategory === cat.name ? 'active' : ''}`}
                                                                    onClick={() => setActiveStickerCategory(
                                                                        activeStickerCategory === cat.name ? null : cat.name
                                                                    )}
                                                                    title={cat.name}
                                                                >
                                                                    {cat.icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="sticker-grid-wrapper">
                                                        {stickerSearchQuery.trim() ? (
                                                            // Search results
                                                            filteredStickers && filteredStickers.length > 0 ? (
                                                                <div className="sticker-grid">
                                                                    {filteredStickers.map((sticker) => (
                                                                        <button
                                                                            key={sticker.emoji}
                                                                            className="sticker-item"
                                                                            onClick={() => handleStickerClick(sticker.emoji)}
                                                                        >
                                                                            {sticker.emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="sticker-no-results">No stickers found</div>
                                                            )
                                                        ) : activeStickerCategory ? (
                                                            // Single category view
                                                            <div className="sticker-category-section">
                                                                <div className="sticker-grid">
                                                                    {STICKER_CATEGORIES.find(c => c.name === activeStickerCategory)?.stickers.map((sticker) => (
                                                                        <button
                                                                            key={sticker.emoji}
                                                                            className="sticker-item"
                                                                            onClick={() => handleStickerClick(sticker.emoji)}
                                                                        >
                                                                            {sticker.emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            // All categories view
                                                            STICKER_CATEGORIES.map((category) => (
                                                                <div key={category.name} className="sticker-category-section">
                                                                    <div className="sticker-category-header">{category.name}</div>
                                                                    <div className="sticker-grid">
                                                                        {category.stickers.slice(0, 16).map((sticker) => (
                                                                            <button
                                                                                key={sticker.emoji}
                                                                                className="sticker-item"
                                                                                onClick={() => handleStickerClick(sticker.emoji)}
                                                                            >
                                                                                {sticker.emoji}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button className="messages-send-btn" onClick={handleSend} aria-label="Send message">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="messages-no-chat">
                                    <div className="messages-no-chat-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                        </svg>
                                    </div>
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
