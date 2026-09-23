export interface Pokemon {
    abilities:                Ability[];
    base_experience:          number;
    cries:                    Cries;
    forms:                    Species[];
    game_indices:             GameIndex[];
    height:                   number;
    held_items:               any[];
    id:                       number;
    is_default:               boolean;
    location_area_encounters: string;
    moves:                    Move[];
    name:                     string;
    order:                    number;
    past_abilities:           PastAbility[];
    past_stats:               PastStat[];
    past_types:               any[];
    species:                  Species;
    sprites:                  Sprites;
    stats:                    Stat[];
    types:                    Type[];
    weight:                   number;
}

export interface Ability {
    is_hidden: boolean;
    slot:      number;
    ability:   Species | null;
}

export interface Species {
    name: string;
    url:  string;
}

export interface Cries {
    latest: string;
    legacy: string;
}

export interface GameIndex {
    game_index: number;
    version:    Species;
}

export interface Move {
    move:                  Species;
    version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
    level_learned_at:  number;
    version_group:     Species;
    move_learn_method: Species;
    order:             number | null;
}

export interface PastAbility {
    generation: Species;
    abilities:  Ability[];
}

export interface PastStat {
    generation: Species;
    stats:      Stat[];
}

export interface Stat {
    base_stat: number;
    effort:    number;
    stat:      Species;
}

export interface GenerationV {
    icons:         Icons;
    "black-white": Sprites;
}

export interface GenerationIv {
    platinum:               Sprites;
    "diamond-pearl":        Sprites;
    "heartgold-soulsilver": Sprites;
}

export interface Versions {
    "generation-i":    GenerationI;
    "generation-v":    GenerationV;
    "generation-ii":   GenerationIi;
    "generation-iv":   GenerationIv;
    "generation-ix":   GenerationIx;
    "generation-vi":   { [key: string]: Home };
    "generation-iii":  GenerationIii;
    "generation-vii":  GenerationVii;
    "generation-viii": GenerationViii;
}

export interface Other {
    home:               Home;
    showdown:           Sprites;
    dream_world:        DreamWorld;
    "official-artwork": OfficialArtwork;
}

export interface Sprites {
    other?:             Other;
    versions?:          Versions;
    back_shiny:         string;
    back_female:        null;
    front_shiny:        string;
    back_default:       string;
    front_female:       null;
    front_default:      string;
    back_shiny_female:  null;
    front_shiny_female: null;
    animated?:          Sprites;
}

export interface Icons {
    animated:      Animated;
    front_default: string;
}

export interface Animated {
    front_default: string;
}

export interface GenerationI {
    yellow:     RedBlue;
    "red-blue": RedBlue;
}

export interface RedBlue {
    back_gray:         string;
    front_gray:        string;
    back_default:      string;
    front_default:     string;
    back_transparent:  string;
    front_transparent: string;
}

export interface GenerationIi {
    gold:    Gold;
    silver:  Gold;
    crystal: Crystal;
}

export interface Crystal {
    animated:                OfficialArtwork;
    back_shiny:              string;
    front_shiny:             string;
    back_default:            string;
    front_default:           string;
    back_transparent:        string;
    front_transparent:       string;
    back_shiny_transparent:  string;
    front_shiny_transparent: string;
}

export interface OfficialArtwork {
    front_shiny:   string;
    front_default: string;
}

export interface Gold {
    back_shiny:         string;
    front_shiny:        string;
    back_default:       string;
    front_default:      string;
    front_transparent?: string;
}

export interface GenerationIii {
    emerald:             OfficialArtwork;
    "ruby-sapphire":     Gold;
    "firered-leafgreen": Gold;
}

export interface GenerationIx {
    "scarlet-violet": DreamWorld;
}

export interface DreamWorld {
    front_female:  null;
    front_default: string;
}

export interface Home {
    front_shiny:        string;
    front_female:       null;
    front_default:      string;
    front_shiny_female: null;
}

export interface GenerationVii {
    icons:                  DreamWorld;
    "ultra-sun-ultra-moon": Home;
}

export interface GenerationViii {
    icons:                             DreamWorld;
    "brilliant-diamond-shining-pearl": DreamWorld;
}

export interface Type {
    slot: number;
    type: Species;
}
