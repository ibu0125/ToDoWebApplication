using ToDo_Backend.Models;

namespace ToDo_Backend.Models {
    public class ListModel {
        public int Id {
            get; set;
        }
        public string? Title {
            get; set;
        }
        public string? Description {
            get; set;
        }

        public DateTime? DueDate {
            get; set;
        }

        public string? user_Id {
            get; set;
        }

        public InformationModel? Info {
            get; set;
        }
    }

}
